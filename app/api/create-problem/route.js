import axios from "axios";
import { currentUserRole, getCurrentUser } from "@/modules/auth/actions";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Ensure your prisma client import

// Judge0 public API endpoint
const JUDGE0_URL = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

// Map language name to Judge0 ID
export const getJudge0LanguageId = (language) => {
  const map = {
    JAVASCRIPT: 63,
    PYTHON: 71,
    JAVA: 62,
  };
  return map[language.toUpperCase()] || null;
};

// Function to run code on Judge0
const runTestCase = async (source_code, language, input, expected_output) => {
  const language_id = getJudge0LanguageId(language);
  if (!language_id) throw new Error(`Unsupported language: ${language}`);

  const response = await axios.post(JUDGE0_URL, {
    source_code,
    language_id,
    stdin: input,
    expected_output,
  });

  return response.data;
};

export async function POST(request) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUser();

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    // Basic validations
    if (!title || !description || !difficulty || !testCases || !codeSnippets || !referenceSolutions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json({ error: "At least one test case is required" }, { status: 400 });
    }

    // Validate each language solution
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      for (const { input, output } of testCases) {
        const result = await runTestCase(solutionCode, language, input, output);

        if (result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: { input, expectedOutput: output, actualOutput: result.stdout, error: result.stderr || result.compile_output },
              details: result,
            },
            { status: 400 }
          );
        }
      }
    }

    // All tests passed, save problem
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { success: true, message: "Problem created successfully", problem: newProblem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json({ error: "Failed to save problem to database" }, { status: 500 });
  }
}
