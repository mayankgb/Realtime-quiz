import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  // Upsert a user for the quiz
  const user = await client.user.upsert({
    where: { email: "mayk03jun@gmail.com" },
    update: {},
    create: {
      email: "mayk03jun@gmail.com",
      password: "mayank0989"
    },
  });

  // Create a JavaScript quiz
  const newQuiz = await client.quiz.create({
    data: {
      name: "JavaScript Mastery Quiz",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png", // Real JS logo
      category: "NORMAL",
      status: "CREATED",
      prizePool: 5000,
      signature: "js-quiz-signature",
      userId: user.id,
      questions: {
        create: [
          {
            text: "What is the output of `console.log(typeof null)`?",
            imageUrl: null,
            correctIndex: 2,
            options: {
              create: [
                { index: 0, text: "null", imageUrl: null },
                { index: 1, text: "undefined", imageUrl: null },
                { index: 2, text: "object", imageUrl: null },
                { index: 3, text: "string", imageUrl: null },
              ],
            },
          },
          {
            text: "Which company developed JavaScript?",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Netscape_logo.png", // Netscape logo
            correctIndex: 0,
            options: {
              create: [
                { index: 0, text: "Netscape", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Netscape_logo.png" },
                { index: 1, text: "Microsoft", imageUrl: null },
                { index: 2, text: "Apple", imageUrl: null },
                { index: 3, text: "Sun Microsystems", imageUrl: null },
              ],
            },
          },
          {
            text: "What is a closure in JavaScript?",
            imageUrl: "https://miro.medium.com/max/1200/1*gK2AKx8jZRFT7JOo_HHrrg.png", // Closure visualization
            correctIndex: 2,
            options: {
              create: [
                { index: 0, text: "A function with no parameters", imageUrl: null },
                { index: 1, text: "A global variable", imageUrl: null },
                { index: 2, text: "A function that retains access to its lexical scope", imageUrl: "https://miro.medium.com/max/1200/1*gK2AKx8jZRFT7JOo_HHrrg.png" },
                { index: 3, text: "A class constructor", imageUrl: null },
              ],
            },
          },
          {
            text: "What will `0.1 + 0.2 === 0.3` return?",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/JavaScript-logo.png/600px-JavaScript-logo.png", // JS logo
            correctIndex: 1,
            options: {
              create: [
                { index: 0, text: "true", imageUrl: null },
                { index: 1, text: "false", imageUrl: null },
                { index: 2, text: "NaN", imageUrl: null },
                { index: 3, text: "undefined", imageUrl: null },
              ],
            },
          },
          {
            text: "What is the use of `Array.prototype.map()`?",
            imageUrl: null,
            correctIndex: 0,
            options: {
              create: [
                { index: 0, text: "To create a new array by applying a function to each element", imageUrl: null },
                { index: 1, text: "To filter elements in an array", imageUrl: null },
                { index: 2, text: "To reverse an array", imageUrl: null },
                { index: 3, text: "To combine arrays", imageUrl: null },
              ],
            },
          },
          {
            text: "Which keyword is used to declare a constant in JavaScript?",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1200px-Unofficial_JavaScript_logo_2.svg.png", // Unofficial JS logo
            correctIndex: 1,
            options: {
              create: [
                { index: 0, text: "var", imageUrl: null },
                { index: 1, text: "const", imageUrl: null },
                { index: 2, text: "let", imageUrl: null },
                { index: 3, text: "define", imageUrl: null },
              ],
            },
          },
          {
            text: "What is the output of `console.log([] + {})`?",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png", // JS logo
            correctIndex: 0,
            options: {
              create: [
                { index: 0, text: "[object Object]", imageUrl: null },
                { index: 1, text: "{}", imageUrl: null },
                { index: 2, text: "[]{}", imageUrl: null },
                { index: 3, text: "undefined", imageUrl: null },
              ],
            },
          },
          {
            text: "Which of the following is not a JavaScript framework?",
            imageUrl: null,
            correctIndex: 2,
            options: {
              create: [
                { index: 0, text: "React", imageUrl: null },
                { index: 1, text: "Vue", imageUrl: null },
                { index: 2, text: "Django", imageUrl: null },
                { index: 3, text: "Angular", imageUrl: null },
              ],
            },
          },
          {
            text: "How can you fetch data from an API in JavaScript?",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png", // React fetch-related image
            correctIndex: 1,
            options: {
              create: [
                { index: 0, text: "Using XMLHttpRequest", imageUrl: null },
                { index: 1, text: "Using `fetch()`", imageUrl: null },
                { index: 2, text: "Using `setTimeout()`", imageUrl: null },
                { index: 3, text: "Using `for` loop", imageUrl: null },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Quiz created:", newQuiz);

  const newQuiz2 = await client.quiz.create({
    data: {
      name: "Python Mastery Quiz",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    category: "NORMAL",
    status: "CREATED",
    prizePool:0,
    userId: user.id, // Replace with an actual user ID,
    signature: "",
    questions: {
      create: [
        {
          text: "What is Python primarily used for?",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          correctIndex: 0,
          options: {
            create: [
              { index: 0, text: "Web Development", imageUrl: null },
              { index: 1, text: "Data Analysis", imageUrl: null },
              { index: 2, text: "Machine Learning", imageUrl: null },
              { index: 3, text: "All of the above", imageUrl: null },
            ],
          },
        },
        {
          text: "Which of these is a Python data type?",
          imageUrl: null,
          correctIndex: 1,
          options: {
            create: [
              { index: 0, text: "Integer", imageUrl: null },
              { index: 1, text: "List", imageUrl: null },
              { index: 2, text: "Character", imageUrl: null },
              { index: 3, text: "Decimal", imageUrl: null },
            ],
          },
        },
        {
          text: "What does the Python logo represent?",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Python.svg",
          correctIndex: 2,
          options: {
            create: [
              { index: 0, text: "A snake", imageUrl: null },
              { index: 1, text: "A programming book", imageUrl: null },
              { index: 2, text: "Two intertwined snakes", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
              { index: 3, text: "A data structure", imageUrl: null },
            ],
          },
        },
        {
          text: "Which company developed Python?",
          imageUrl: null,
          correctIndex: 3,
          options: {
            create: [
              { index: 0, text: "Google", imageUrl: null },
              { index: 1, text: "Apple", imageUrl: null },
              { index: 2, text: "Microsoft", imageUrl: null },
              { index: 3, text: "Python Software Foundation", imageUrl: null },
            ],
          },
        },
        {
          text: "What keyword is used to define a function in Python?",
          imageUrl: null,
          correctIndex: 0,
          options: {
            create: [
              { index: 0, text: "def", imageUrl: null },
              { index: 1, text: "function", imageUrl: null },
              { index: 2, text: "fun", imageUrl: null },
              { index: 3, text: "define", imageUrl: null },
            ],
          },
        },
        {
          text: "What is the correct file extension for Python files?",
          imageUrl: null,
          correctIndex: 2,
          options: {
            create: [
              { index: 0, text: ".python", imageUrl: null },
              { index: 1, text: ".pyc", imageUrl: null },
              { index: 2, text: ".py", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Python.svg" },
              { index: 3, text: ".pyt", imageUrl: null },
            ],
          },
        },
        {
          text: "Which of these is NOT a Python framework?",
          imageUrl: null,
          correctIndex: 1,
          options: {
            create: [
              { index: 0, text: "Django", imageUrl: null },
              { index: 1, text: "Laravel", imageUrl: null },
              { index: 2, text: "Flask", imageUrl: null },
              { index: 3, text: "Pyramid", imageUrl: null },
            ],
          },
        },
        {
          text: "What is the output of print(2 ** 3)?",
          imageUrl: null,
          correctIndex: 0,
          options: {
            create: [
              { index: 0, text: "8", imageUrl: null },
              { index: 1, text: "6", imageUrl: null },
              { index: 2, text: "9", imageUrl: null },
              { index: 3, text: "Error", imageUrl: null },
            ],
          },
        },
        {
          text: "Which Python library is used for data manipulation?",
          imageUrl: null,
          correctIndex: 2,
          options: {
            create: [
              { index: 0, text: "NumPy", imageUrl: null },
              { index: 1, text: "Matplotlib", imageUrl: null },
              { index: 2, text: "Pandas", imageUrl: null },
              { index: 3, text: "SciPy", imageUrl: null },
            ],
          },
        },
        {
          text: "What does the 'pip' command do?",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          correctIndex: 3,
          options: {
            create: [
              { index: 0, text: "Installs Python", imageUrl: null },
              { index: 1, text: "Starts Python interpreter", imageUrl: null },
              { index: 2, text: "Builds Python packages", imageUrl: null },
              { index: 3, text: "Installs Python packages", imageUrl: null },
            ],
          },
        },
      ],
    },
    },
  });

  console.log("new quiz create", newQuiz2)
}

main()
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
  })
  .then(async () => {
    await client.$disconnect();
  });

