import { Inter } from "next/font/google";
import HeaderSimple from "@/components/HeaderSimple";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main
        className={`flex flex-col bg-indigo-900 text-white ${inter.className} h-full`}
      >
        <HeaderSimple aboutLink="/about" githubLink="" version="0.0.1" />
        <div className="flex flex-col w-full max-w-[600px] pl-6 pr-6 ml-auto mr-auto pt-12 space-y-6 pb-24">
          <h1 className="text-4xl font-bold text-white mb-4">
            About zapin.me...
          </h1>

          <h2 className="text-2xl font-bold text-pink-200 mb-4">The Idea</h2>
          <p className="text-lg">
            Welcome to <span className="font-bold">zapin.me</span>—where your
            thoughts leave a lasting mark on a public map, powered by the{" "}
            <span className="font-bold text-yellow-400">Lightning Network</span>
            !
          </p>

          <p className="text-lg">
            This journey began with a deep dive into the{" "}
            <Link
              href="https://github.com/ACINQ/phoenixd"
              className="text-pink-300 hover:text-pink-400 underline font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Phoenix repository by ACINQ
            </Link>
            , where I was exploring the capabilities of Phoenixd as a backend
            for Lightning payments. What started as a technical experiment
            quickly evolved into something more—a platform where anyone can pin
            a message on a global map for all to see, while also supporting
            open-source development.
          </p>
          <h2 className="text-2xl font-bold text-pink-200 mb-4 pt-10">
            How It Works
          </h2>
          <p className="text-lg">
            On <span className="font-bold">zapin.me</span>, each message you pin
            is fueled by Satoshis.
          </p>
          <div className="text-lg font-bold text-yellow-300 my-4">
            1 minute = 1 Satoshi
          </div>
          <p className="text-lg">
            This means that you have full control over how long your message
            remains on the map. For example:
          </p>
          <ul className="list-disc list-inside text-lg ml-4">
            <li>
              <span className="font-bold text-yellow-300">1 Satoshi</span> keeps
              your message visible for 1 minute.
            </li>
            <li>
              <span className="font-bold text-yellow-300">360 Satoshis</span>{" "}
              keeps your message visible for 6 hours.
            </li>
            <li>
              <span className="font-bold text-yellow-300">3600 Satoshis</span>{" "}
              keeps your message visible for 60 hours.
            </li>
          </ul>

          <p className="text-lg">
            It&apos;s a fun and interactive way to engage with the community and
            maybe even earn a few Satoshis along the way!
          </p>

          <h2 className="text-2xl font-bold text-pink-200 mb-4 pt-10">
            Technologies Used
          </h2>
          <p className="text-lg">
            <span className="font-bold">zapin.me</span> is built with a stack of
            modern technologies to ensure a smooth and reliable experience.
            Here’s a look at what powers the site:
          </p>
          <h3 className="text-xl font-semibold text-white mt-4 mb-2">
            Frontend
          </h3>
          <ul className="list-disc list-inside text-lg ml-4">
            <li>
              <span className="font-bold text-pink-300">Next.js</span> for the
              overall frontend framework, providing fast performance and a
              smooth user experience.
            </li>
            <li>
              <span className="font-bold text-pink-300">React</span> as the core
              library for building the user interface.
            </li>
            <li>
              <span className="font-bold text-pink-300">Tailwind CSS</span> for
              easy and efficient styling with a utility-first approach.
            </li>
            <li>
              <span className="font-bold text-pink-300">Leaflet</span> and{" "}
              <span className="font-bold text-pink-300">React-Leaflet</span> for
              the interactive map, allowing users to pin messages.
            </li>
            <li>
              <span className="font-bold text-pink-300">Lucide React</span> for
              the icon set, ensuring a clean and modern look.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-4 mb-2">
            Backend
          </h3>
          <ul className="list-disc list-inside text-lg ml-4">
            <li>
              <span className="font-bold text-pink-300">TypeScript</span> for
              the backend, ensuring type safety and scalability.
            </li>
            <li>
              <span className="font-bold text-pink-300">Express</span> as the
              server framework, handling routing and API requests.
            </li>
            <li>
              <span className="font-bold text-pink-300">Socket.io</span> for
              real-time communication between the client and server.
            </li>
            <li>
              <span className="font-bold text-pink-300">SQLite</span> for
              lightweight and efficient data storage.
            </li>
            <li>
              <a
                href="https://github.com/miguelmedeiros/phoenix-server-js"
                className="text-pink-300 font-bold hover:text-pink-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Phoenixd-server-js
              </a>{" "}
              for seamless integration with the Phoenixd backend.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-4 mb-2">
            Development & Deployment
          </h3>
          <ul className="list-disc list-inside text-lg ml-4">
            <li>
              <span className="font-bold text-pink-300">Docker Compose</span> to
              easily spin up the entire project with a single command.
            </li>
            <li>
              <span className="font-bold text-pink-300">Nodemon</span> for
              automatic restarts during development, improving workflow
              efficiency.
            </li>
            <li>
              <span className="font-bold text-pink-300">ESLint</span> for
              maintaining code quality and consistency across the project.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-pink-200 mb-4 pt-10">
            Docker Compose Setup
          </h2>
          <p className="text-lg">
            Setting up <span className="font-bold">zapin.me</span> is
            straightforward, thanks to{" "}
            <span className="font-bold text-pink-300">Docker Compose</span>. The
            project includes a pre-configured{" "}
            <code className="bg-gray-800 p-1 rounded">docker-compose.yml</code>{" "}
            file that orchestrates the frontend, backend, and Phoenixd services
            seamlessly. With a single command, you can have the entire stack up
            and running on your machine:
          </p>
          <pre className="bg-gray-800 text-white p-4 rounded-lg">
            <code>docker-compose up --build</code>
          </pre>
          <p className="text-lg">
            This command will build and start all the necessary services, making
            it incredibly easy to contribute to the project or run your own
            instance of zapin.me.
          </p>

          <h2 className="text-2xl font-bold text-pink-200 mb-4 pt-10">
            Open-Source Commitment
          </h2>
          <p className="text-lg">
            <span className="font-bold">zapin.me</span> is more than just a
            project — it&apos;s a growing community. I’m committed to keeping it
            fully <span className="font-bold text-pink-300">open-source</span>{" "}
            under the{" "}
            <span className="font-bold text-pink-300">MIT License</span>. I hope
            you enjoy using the site as much as I enjoyed building it. If you
            find it useful or just plain fun, consider contributing to the
            project on{" "}
            <a
              href="https://github.com/miguelmedeiros/zapin.me"
              className="text-pink-400 hover:text-pink-300 underline font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            . Your support not only helps keep the map alive with vibrant
            messages but also drives the continuous improvement of the platform.
          </p>

          <div className="text-center pt-3">
            <a
              href="https://github.com/miguelmedeiros/zapin.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 transition duration-200"
            >
              Contribute on GitHub
            </a>
          </div>

          <div className="text-lg font-bold text-yellow-300 pt-3 text-left">
            Together, let&apos;s light up the map, one satoshi at a time!
          </div>

          <Link
            href="https://github.com/miguelmedeiros"
            target="_blank"
            className="text-lg font-bold text-white mt-8 text-right underline"
          >
            <Tooltip tooltipText="Made with ❤️ to the Bitcoin community!">
              Miguel Medeiros
            </Tooltip>
          </Link>
        </div>
      </main>
    </>
  );
}
