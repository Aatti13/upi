# Cloning/Installation Guide

## Cloning the repository

- Clone the repository in a blank editor (say VSCode) using the command:

  ```bash
  git clone https://github.com/Aatti13/upi.git
  ```
  it this doesn't work try including the link in double-quotation

  ```bash
  git clone "https://github.com/Aatti13/upi.git"
  ```

  You have now successfully cloned the Repository. 

---
## Backend Installation & Running Scripts

### Installation

- we are given the following folder structure
  
  ```bash
  upi/
  ├── backend/ # Node.js + Express backend (API, auth, transactions)
  ├── frontend/ # Frontend (React/Next.js or similar)
  ├── docs/ # Documentation, architecture diagrams, notes
  ├── .gitignore # Ignored files and folders (e.g., node_modules)
  └── README.md # You're here!
  ```

  Now go to the backend folder, make it the current working directory and then use the `npm install` command

  ```bash
  cd backend
  npm install
  ```

  An alternative to this is using the `npm ci` command

  ```bash
  cd backend
  npm ci
  ```

  You now have successfully installed the required packages via npm!

### Running

- Now for running the backend file(s)

  We can check the `package.json` file for details:

  ```bash
  {
    "name": "backend",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "dev": "nodemon index.js",
      "start": "node index.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "type": "module",
    "dependencies": {
      "dotenv": "^16.6.0",
      "express": "^5.1.0",
      "mongoose": "^8.16.1"
    },
    "devDependencies": {
      "nodemon": "^3.1.10"
    }
  }
  ```

  here we can see in order to test running **without** hot-module reloading:
  ```bash
  npm start
  ```

  Whereas, if you want continuous running and hot-module reloading (HMR):
  ```bash
  npm run dev
  ```

  You Can now run your backend!

---
## Frontend Installation & Running

### Installation

- Now for the frontend, we are currently in the backend folder, make the parent directory the current working directory.

  ```bash
  cd.. # For powershell Command-line
  cd .. # For git-bash and WSL related command-lines
  ```

  Go to the `frontend` folder & install the dependencies:

  ```bash
  cd frontend
  npm install
  ```

  Alternative you can use `npm ci` for this

  ```bash
  cd frontend
  npm ci
  ```
  You now have successfully installed frontend dependencies.

### Running

  Now running the frontend scripts, first we must be in the `frontend` directory

  ```bash
  cd frontend
  ```

  Now checking the `package.json` script:

  ```bash
    {
      "name": "frontend",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint .",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "^19.1.0",
        "react-dom": "^19.1.0"
      },
      "devDependencies": {
        "@eslint/js": "^9.29.0",
        "@types/react": "^19.1.8",
        "@types/react-dom": "^19.1.6",
        "@vitejs/plugin-react-swc": "^3.10.2",
        "eslint": "^9.29.0",
        "eslint-plugin-react-hooks": "^5.2.0",
        "eslint-plugin-react-refresh": "^0.4.20",
        "globals": "^16.2.0",
        "vite": "^7.0.0"
      }
    }
```

We can use the folowing command to run the frontend

```bash
npm run dev
```

You can now successfully run the frontend!

---
## Additional Information

In order to run them together you'll need 2 terminals, could preferably use split terminal.




