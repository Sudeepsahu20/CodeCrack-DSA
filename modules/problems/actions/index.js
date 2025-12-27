'use server'
import axios from "axios";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import { getJudge0LanguageId } from "@/app/api/create-problem/route";
import { getLanguageName } from "@/lib/judge0";
import { revalidatePath } from "next/cache";


export const getAllProblems = async () => {
  try {
    const user = await currentUser();
    const data = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
      },
    });
    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: data.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { success: true, data: problems };
  } catch (error) {
    console.error("❌ Error fetching problems:", error);
    return { success: false, error: "Failed to fetch problems" };
  }
};

export const getProblemById = async(id) => {
    try {
        const problem = await db.problem.findUnique({
            where: {
                id: id,
            },
        });
        return { success: true, data: problem };
    } catch (error) {
        console.error("❌ Error fetching problem:", error);
        return { success: false, error: "Failed to fetch problem" };
    }
}

export const deleteProblem = async (problemId) => {
    try {
        const user = await currentUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        // Verify if user is admin
        const dbUser = await db.user.findUnique({
            where: { clerkId: user.id },
            select: { role: true }
        });

        if (dbUser?.role !== UserRole.ADMIN) {
            throw new Error("Only admins can delete problems");
        }

        await db.problem.delete({
            where: { id: problemId }
        });

        revalidatePath("/problems");
        return { success: true, message: "Problem deleted successfully" };
    } catch (error) {
        console.error("Error deleting problem:", error);
        return { success: false, error: error.message || "Failed to delete problem" };
    }
}

export const executeCode = async (
  source_code,
  language_id,
  stdin,
  expected_outputs,
  id
) => {
  const user = await currentUser();

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    return { success: false, error: "Invalid test cases" };
  }

  let allPassed = true;
  const detailedResults = [];

  // 🔥 IMPORTANT: single submission per test case
  for (let i = 0; i < stdin.length; i++) {
    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code,
        language_id,
        stdin: stdin[i],
        expected_output: expected_outputs[i],
      }
    );

    const result = response.data;

    const stdout = result.stdout?.trim() || null;
    const expected = expected_outputs[i]?.trim();
    const passed = stdout === expected;

    if (!passed) allPassed = false;

    detailedResults.push({
      testCase: i + 1,
      passed,
      stdout,
      expected,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status?.description,
      memory: result.memory ? `${result.memory} KB` : null,
      time: result.time ? `${result.time} s` : null,
    });
  }

  // 💾 Save submission
  const submission = await db.submission.create({
    data: {
      userId: dbUser.id,
      problemId: id,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compile_output)
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: JSON.stringify(detailedResults.map((r) => r.memory)),
      time: JSON.stringify(detailedResults.map((r) => r.time)),
    },
  });

  // 🏆 Mark solved
  if (allPassed) {
    await db.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId: dbUser.id,
          problemId: id,
        },
      },
      update: {},
      create: {
        userId: dbUser.id,
        problemId: id,
      },
    });
  }

  // 🧪 Save test case results
  await db.testCaseResult.createMany({
    data: detailedResults.map((r) => ({
      submissionId: submission.id,
      testCase: r.testCase,
      passed: r.passed,
      stdout: r.stdout,
      expected: r.expected,
      stderr: r.stderr,
      compileOutput: r.compile_output,
      status: r.status,
      memory: r.memory,
      time: r.time,
    })),
  });

  const submissionWithTestCases = await db.submission.findUnique({
    where: { id: submission.id },
    include: { testCases: true },
  });

  return { success: true, submission: submissionWithTestCases };
};

export const getAllSubmissionByCurrentUserForProblem = async (problemId) => {
    const user = await currentUser();
    const userId = await db.user.findUnique({
        where: {
            clerkId: user.id,
        },
        select: {
            id: true,
        },
    });
    const submissions = await db.submission.findMany({
        where: {
            problemId: problemId,
            userId: userId.id,
        },
    });
    return { success: true, data: submissions };
}