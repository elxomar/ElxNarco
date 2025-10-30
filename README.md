# *Project Title:* Narco Life RPG

*Objective:*
Create a functional foundation for an online text-based open-world RPG web app. Players start as low-level criminals in Mexico or the U.S. and progress by completing missions, trading goods, and upgrading skills to rise in the criminal hierarchy. Gameplay combines strategy, management, and role-playing elements, emphasizing meaningful choices and progression.

*Technology Stack:*

- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Database: AWS DynamoDB
- Authentication: AWS Cognito
- Hosting: AWS Amplify
- Server Logic: AWS Lambda Functions
- Optional AI Expansion: Amazon Bedrock (for procedural missions and NPC dialogue later)

*Core Features:*

1. *Authentication & Player Management*
    - AWS Cognito handles login, registration, and logout.
    - Each user can create up to 3 characters.
    - Store all player data (stats, skills, inventory, money, XP) in DynamoDB.
    - Implement character deletion and data removal.
2. *Main Menu (Game Hub)*
    - Display a dashboard showing:
        - Player name, level, cash, XP, stamina, health.
        - Buttons leading to:
            - Travel Map
            - Missions
            - Streets
            - Inventory
            - Skill Tree
            - Character List
            - Logout
3. *Travel Map*
    - Two regions: Mexico (Tijuana, Juarez, Puerto Vallarta) and U.S. (Los Angeles, Miami, New York).
    - Traveling costs money and stamina.
    - Each city has unique NPCs and missions.
    - Implement travel confirmation and stamina deduction.
4. *Missions*
    - 10 starter missions stored in DynamoDB.
    - Each mission includes:
        - Title, description, difficulty, requirements, rewards (cash + XP).
    - Mission outcomes determined by skills (Strength, Intelligence, Endurance, Shooting).
    - Lambda function calculates success, applies rewards, and updates character record.
    - Implement mission failure consequences (e.g., loss of resources, reputation).
5. *Streets (Marketplace)*
    - List NPCs who buy/sell items and drugs.
    - Each NPC has different prices that fluctuate over time.
    - Allow buying and selling, updating the database instantly.
    - Implement transaction validation and error handling.
6. *Inventory System*
    - Display owned items and quantities.
    - Actions: Use, Sell, Drop.
    - Dynamic updating of inventory and cash balance.
    - Implement item stacking and quantity management.
7. *Skill Tree*
    - Skills: Strength, Intelligence, Endurance, Shooting.
    - Spend XP to improve skills.
    - Updated instantly in database and visible in UI.
    - Implement skill level caps and XP requirements.
8. *Character Progression*
    - Level = XP accumulation.
    - Higher levels unlock harder missions and rarer NPCs.
    - Auto-save after each main action.

*Visual Style & Color Palette:*

- Theme: Gritty, dark urban underworld atmosphere with subtle satire.
- Primary Colors:
    - Charcoal Black #0E0E0E
    - Deep Gray #1C1C1C
    - Crimson Red #B30000
    - Muted Gold #D4AF37
    - Pale White #EAEAEA
- Typography: Bold sans-serif (Montserrat or Oswald).
- UI Direction:
    - Interface inspired by the illustrated, cinematic look of “Grand Theft Auto V” loading screens — vivid colors, heavy shadows, and polished gradients.
    - Centered dashboard with crisp rectangular buttons.
    - Soft hover transitions and gradient glows.
    - Subtle background vignette for depth.
    - Persistent HUD showing player cash, health, and stamina.

*Implementation Requirements:*

- Organize folders:
    - /frontend → React + TailwindCSS UI
    - /backend → Express API and Lambda handlers
    - /infrastructure → Amplify configuration
- Use async/await for all API operations.
- Add meaningful comments above each function (purpose, inputs, outputs).
- Include placeholder NPCs, missions, and player data to avoid empty renders.
- Apply clean, consistent naming and indentation.
- Follow Amplify’s recommended project structure and CI/CD setup.
- Function as a senior developer genius establishing a foundation for younger team members.
- Work extremely organized and professional, efficiently.
- Markup code with clear documentation and comments.

*Deliverable:*

Produce a fully functional prototype that allows users to:

1. Register / log in
2. Create and manage up to three characters
3. View and navigate the main menu
4. Travel between cities
5. Complete missions (with backend logic and rewards)
6. Trade with NPCs
7. View inventory and upgrade skills

The build must be live-ready — hosted through AWS Amplify with connected DynamoDB, and the code structured for continuous updates via GitHub.

*Final Goal:*
Deliver a visually appealing, responsive, and functional foundation for Narco Life RPG — a browser-based text RPG that feels immersive, fast, and expandable. Code as if crafting the core framework for a studio-quality game project.