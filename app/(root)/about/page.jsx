export const dynamic = 'force-dynamic';
import {
  Code2,
  Terminal,
  Database,
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 mt-15">

      {/* Intro */}
      <section>
        <h1 className="text-3xl font-bold mb-2 text-amber-400">
          About This Platform
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          This is a LeetCode-inspired online coding platform built to practice
          Data Structures & Algorithms with real code execution and test cases.
        </p>
      </section>

      {/* What I Built */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-amber-400">
          <Code2 className="w-6 h-6" /> What I Built
        </h2>

        <ul className="space-y-3 text-muted-foreground list-disc pl-6">
          <li>Create and solve coding problems</li>
          <li>Run code against multiple test cases</li>
          <li>Get verdicts like Accepted / Wrong Answer</li>
          <li>Track submissions and solved problems</li>
        </ul>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-amber-400">
           Tech Stack Used
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <TechItem title="Next.js (App Router)"  />
          <TechItem title="React.js" />
          <TechItem title="Monaco Editor" />
          <TechItem title="Judge0 API" />
          <TechItem title="Node.js & Express" />
          <TechItem title="MongoDB & Prisma" />
          <TechItem title="shadcn/ui" />
          <TechItem title="lucide-react Icons" />
        </div>
      </section>

      {/* About Developer */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-amber-400">
          About the Developer
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Hi, I’m <b>Sudeep Sahu</b>, an aspiring software developer and problem
          solver. I enjoy building full-stack applications and strengthening my
          DSA fundamentals by creating real-world platforms like this one.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-amber-400">
          <Database className="w-6 h-6" /> Contact
        </h2>

         <div className="space-y-3 text-muted-foreground">

    <p className="flex items-center gap-2">
      <Mail className="w-4 h-4" />
      <a
        href="mailto:sudeepsahu2027@gmail.com"
        className="hover:underline"
      >
        sudeepsahu2027@gmail.com
      </a>
    </p>

    <p className="flex items-center gap-2">
      <Phone className="w-4 h-4" />
      <a
        href="tel:08819017873"
        className="hover:underline"
      >
        8819017873
      </a>
    </p>

    <p className="flex items-center gap-2">
      <Github className="w-4 h-4" />
      <a
        href="https://github.com/Sudeepsahu20"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue-500"
      >
        github.com/Sudeepsahu20
      </a>
    </p>

    <p className="flex items-center gap-2">
      <Linkedin className="w-4 h-4" />
      <a
        href="https://www.linkedin.com/in/sudeep-sahu-035a8328b"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue-500"
      >
        linkedin.com/in/sudeep-sahu
      </a>
    </p>
    </div>
      </section>
    </div>
  );
}

function TechItem({ title }) {
  return (
    <div className="border rounded-xl p-4 text-center text-sm font-medium">
      {title}
    </div>
  );
}