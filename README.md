# 🌾 AgTrackr

A simple, user-friendly web application built with **React**, **AWS Amplify**, and **Tailwind CSS**, designed to help farmers and small agricultural businesses track their farm-related expenses without the hassle of spreadsheets or piles of receipts.

---

## 🚜💻 Project Description

After countless late nights (and way too much caffeine ☕), I’m excited to share something I’ve been working hard on—**Farm Expense Tracker**! It’s a simple, clean app built to help farmers (or anyone running a small or hobby farm) easily track their expenses—no more digging through piles of receipts or stressing over spreadsheets.

We were doing it the old-school way... envelope stuffed with receipts. Now? It’s all streamlined. ✅

---

## 💡 Features

- ✅ Enter and track expenses easily by category (Feed, Seed, Fuel, Repairs, etc.)
- ✅ View everything on a simple, clean dashboard
- ✅ Analyze where your money’s going so tax time isn’t a headache
- ✅ Secure user login and registration—your data stays safe!
- ✅ Responsive design—works great on desktop, tablet, or mobile!

---

## 🛠️ Tech Stack

- **Frontend:** React
- **Styling:** Tailwind CSS
- **Backend / Authentication:** AWS Amplify
- **State Management:** React Hooks and Context API
- **Build Tool:** Vite

---

## ⚙️ Local Installation and Setup

Follow these steps to get the project running locally on your machine.

### 1. Clone the repository
Open your terminal and run:
```bash
git clone https://github.com/yourusername/farm-expense-tracker.git
cd farm-expense-tracker
2. Install project dependencies
Make sure you have Node.js and npm installed. Then run:

npm install

3. Start the development server
Launch the app locally:

npm run dev
By default, the app runs at http://localhost:5173.

🔐 AWS Amplify Setup
You'll need an AWS account to deploy backend services like authentication and data storage.

1. Install the Amplify CLI globally

npm install -g @aws-amplify/cli

2. Configure Amplify CLI with your AWS account
This step sets up your access credentials.


amplify configure
Follow the CLI prompts to:

Sign in to your AWS account
Create a new IAM user
Set up your AWS access keys locally
3. Initialize Amplify in the project
If Amplify isn't already initialized, run:

amplify init
4. Push the backend environment to AWS
This deploys backend resources (authentication, database, etc.)


amplify push
5. Add Authentication (if not already added)

amplify add auth
Choose the default configuration or customize it for your needs.

6. Push the authentication changes

amplify push
📝 How to Contribute
If you’re testing the app or want to contribute, here’s how you can help:

🐛 Report Bugs
If you spot something broken or buggy, let me know!

💡 Suggest Features or Improvements
Got an idea for a new feature? Something you wish was easier? I’m all ears.

🛠️ Give UI/UX Feedback
Tell me what’s confusing or what works well. The goal is to make this as simple and helpful as possible!

📬 Feedback & Testing Call
I'm actively looking for testers and feedback!
If you're willing to try it out and give honest input, please DM me.

I'm especially interested in:

New feature ideas 💡
Things that could be easier to use 🛠️
Bugs or weird stuff happening 🐛
This is just the beginning, and I want it to be as helpful as possible for real users like you. Thanks for any help you can throw my way! 🙏

🌱 Roadmap & Future Ideas
Income tracking
Budget forecasting
Receipt image uploads
Offline mode
Mobile app version
Export data (CSV/Excel)
Multi-user / family farm support
📜 License
This project is licensed under the MIT License.
Feel free to fork, clone, or contribute!

👨‍💻 Author
Reece Nunez
LinkedIn | GitHub

---

### ✅ What's included:
- Full **installation instructions** (local + AWS Amplify backend)
- **Contribution guidelines**
- **Feedback request section**
- **Future roadmap** ideas
- **License & author** info
- Clean and easy-to-read **Markdown structure**

Features to add:
1. Inventory tracker
  - track livestock, chickens, food storage, etc.
  - track where and how many livestock you have, what kind of livestock and also track field switching
  - have activity log and health log
2. Invoice creator
  - create invoice
  - send invoice via email
3. Mileage tracker
