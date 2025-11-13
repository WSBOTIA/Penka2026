# Penka App

Penka App is a mobile application for creating and participating in sports prediction pools (known as "penkas"). Users can create leagues, invite friends, add matches, and make predictions on the outcomes. The app automatically calculates and displays user scores based on the final results of the matches.

## Table of Contents

- [Installation](#installation)
- [Functionalities](#functionalities)
  - [User Management](#user-management)
  - [League Management](#league-management)
  - [Match Management](#match-management)
  - [Admin Features](#admin-features)
- [Technologies Used](#technologies-used)

## Installation

To get the application up and running on your local machine, please follow these steps:

1.  **Prerequisites:**
    *   Node.js (v18 or newer recommended)
    *   npm or yarn
    *   Expo Go app on your mobile device (iOS or Android) or a web browser for testing.

2.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    ```

3.  **Navigate to the Project Directory:**
    ```bash
    cd penka-app
    ```

4.  **Install Dependencies:**
    ```bash
    npm install
    ```

5.  **Set Up Firebase Credentials:**
    *   This project uses Firebase for its backend services. You will need to create a new Firebase project.
    *   Once your project is created, obtain your Firebase configuration credentials.
    *   Create a `.env` file in the `penka-app` directory by copying the `.env.example` file.
    *   Fill in the `.env` file with your actual Firebase project credentials.

6.  **Run the Application:**
    ```bash
    npx expo start
    ```
    This command will start the Metro Bundler. You can then:
    *   Scan the QR code shown in the terminal or browser with the Expo Go app on your phone.
    *   Press `w` in the terminal to open the app in your default web browser.

## Functionalities

### User Management
-   **Authentication:** Users can sign up, log in, and log out.
-   **Profile Management:** Users can view and update their profile information.

### League Management
-   **Create Leagues:** Users can create their own prediction leagues (championships).
-   **Custom Scoring Rules:** When creating a league, the administrator can define a custom scoring system (e.g., points for an exact score match, for correctly predicting the winner, or for a draw).
-   **Invite Participants:** League creators can invite other users to join their league.

### Match Management
-   **Add Matches:** The league administrator can add new matches to the league, specifying the two teams and the date/time of the match.
-   **Make Predictions:** Participants can submit their score predictions for any match within the league.
-   **Assign Final Scores:** The league administrator can input the final, official score for a match once it has concluded.
-   **Automatic Point Calculation:** As soon as a final score is submitted, the system automatically processes all user predictions for that match and assigns points based on the league's pre-configured scoring rules.

### Admin Features
-   **Banner Management:** An administrator can add, update, or delete promotional banners that are displayed on the application's main screen.
-   **Match Mini-Banners:** Administrators can upload a specific "mini-banner" image for each match.
-   **Team Flags:** The system automatically displays the national flag next to a team's name if it matches a known country.

## Technologies Used

-   **Frontend:** React Native with Expo
-   **Backend & Database:** Firebase (Firestore, Firebase Authentication, Firebase Storage)
-   **Styling:** NativeWind (Tailwind CSS for React Native)
-   **Navigation:** Expo Router
