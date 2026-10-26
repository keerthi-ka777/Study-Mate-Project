# 🌈 StudyMate — Student Study Planner

> **Make every study session count.** A colourful, responsive study planner built with HTML, CSS, and vanilla JavaScript.

StudyMate gives students one friendly place to organise assignments, plan study sessions, track completion, and celebrate progress. It is designed as a beginner-friendly Full Stack Development AAT1 front-end project.

## ✨ Features

- **Friendly dashboard:** task totals, completed tasks, estimated study hours, and completion percentage.
- **Task CRUD:** create, view, edit, complete, and delete study tasks.
- **Subject and priority labels:** organise work by subject and urgency.
- **Search and filters:** find tasks by title, subject, or notes; filter by status and subject.
- **Study schedule:** see unfinished tasks grouped by due date.
- **Browser persistence:** tasks are saved with `localStorage`, so they remain after refreshing the same browser.
- **Colourful responsive UI:** pastel cards, gradient hero banner, progress garden, mobile-friendly layout, and a dark theme toggle.
- **Starter demo data:** explore the interface before adding your own tasks.

## 🧰 Technologies used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure, forms, task sections, and accessible labels |
| CSS3 | Layout, responsive breakpoints, gradients, cards, transitions, and dark theme |
| Vanilla JavaScript | Task operations, validation, search, filters, statistics, schedule rendering, and storage |
| Browser `localStorage` | Saves tasks locally in the user's browser |

**Note:** This version is a front-end web application. It does not use a server, framework, or cloud database. `localStorage` is local to one browser/device and is not shared between users.

## 📁 Project structure

```text
StudyMate-Student-Study-Planner/
├── index.html     # Main application structure
├── style.css      # Colourful responsive design
├── script.js      # App logic and browser storage
└── README.md      # Project documentation
```

## 🚀 Run locally

No installation or build step is required.

### Option 1 — Open directly

1. Download or clone this repository.
2. Open the project folder.
3. Double-click `index.html` to open it in a modern browser.

### Option 2 — VS Code + Live Server

1. Open the folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.

The page uses Google Fonts when internet access is available; system fallback fonts are used otherwise.

## 🧪 Testing checklist

- [ ] Dashboard displays task statistics.
- [ ] Add a task with a title, subject, date, priority, duration, and optional notes.
- [ ] Edit a task and verify the updated information.
- [ ] Mark a task complete and check that statistics update.
- [ ] Delete a task and confirm the prompt.
- [ ] Search by a task title or subject.
- [ ] Filter by status and subject.
- [ ] Open the Study Schedule and check due-date grouping.
- [ ] Refresh the page and verify tasks remain saved.
- [ ] Toggle dark mode and check readability.
- [ ] Resize the browser to test mobile responsiveness.

## 🧠 How it works

1. `index.html` defines the dashboard, task list, schedule, and task form modal.
2. `style.css` provides the visual design and responsive layout.
3. `script.js` stores tasks in an array, updates the interface after changes, and persists the array in `localStorage`.
4. The rendering functions generate the dashboard summary, task cards, filters, and date-grouped schedule.
5. Form validation ensures the required task fields are filled before a task is saved.

## ⌨️ Git and GitHub setup

Create a **separate repository** for StudyMate so it stays independent from other projects.

1. Sign in to [GitHub](https://github.com/new) and create a repository named `StudyMate-Student-Study-Planner`.
2. If you are pushing these files for the first time, leave GitHub's “Add a README” option unchecked because this folder already contains one.
3. Open Terminal in this project folder and run:

```bash
git init
git branch -M main
git add index.html style.css script.js README.md
git commit -m "Initial commit: StudyMate student planner"
git remote add origin git@github.com:YOUR-USERNAME/StudyMate-Student-Study-Planner.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If the local folder already has a Git repository, do not run `git init` again. If you have already configured a remote, check it with `git remote -v` rather than adding it a second time.

If you prefer HTTPS, copy the HTTPS URL shown by GitHub and use it in the `git remote add origin` command instead.

## 🌱 Possible future improvements

- Add a Pomodoro focus timer.
- Add weekly study analytics and a calendar view.
- Add export/import for task backups.
- Add a backend API and database if the assessment later requires full-stack persistence.
- Add user accounts and synchronisation only with an appropriately secured backend.

## 🎓 Assessment note

StudyMate demonstrates front-end development concepts including semantic HTML, responsive CSS, JavaScript event handling, form validation, CRUD operations, DOM updates, filtering, and browser storage. Review the code and be ready to explain the main functions during your assessment.

---

Made with 💜 for curious minds and future achievers.
