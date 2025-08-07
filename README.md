# Learning Adventures - Educational App for Autistic Children

A tablet-first educational app built with Expo/React Native that combines photo-taking, voice learning, and writing activities.

## Features

### Child Interface
- **Photo Tasks**: Find and photograph specific objects
- **Voice Recording**: Describe what they found
- **Writing Activities**: Write stories about their discoveries
- **Progress Tracking**: Level system with points and achievements
- **Offline Support**: Works without internet connection

### Parent Dashboard
- **Task Management**: Create and assign custom tasks
- **Progress Monitoring**: Track child's learning journey
- **Reports**: Detailed analytics and insights
- **Settings**: Customize app behavior and difficulty

## Architecture

### Offline-First Design
- SQLite database for local storage
- Automatic sync when online
- Queue system for pending actions
- Robust error handling

### Key Technologies
- **Expo SDK 49**: Cross-platform development
- **React Navigation**: Screen navigation
- **Expo Camera**: Photo capture
- **Expo AV**: Voice recording
- **SQLite**: Local database
- **AsyncStorage**: Settings and cache

## Getting Started

### Prerequisites
- Node.js 16+
- Expo CLI
- iOS Simulator or physical iPad

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd autism-learning-app
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Start the development server
\`\`\`bash
expo start
\`\`\`

4. Run on iOS
\`\`\`bash
expo start --ios
\`\`\`

### Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── navigation/         # Navigation configuration
├── screens/           # Screen components
│   ├── child/         # Child interface screens
│   └── parent/        # Parent dashboard screens
├── services/          # Database and API services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
\`\`\`

## Key Features Implementation

### Photo Recognition
- Uses Expo Camera for image capture
- Placeholder for ML/AI object detection
- Visual feedback for successful matches

### Voice Recording
- Expo AV for audio recording
- Speech-to-text capabilities (placeholder)
- Playback functionality

### Offline Sync
- Queue system for offline actions
- Automatic sync when connection restored
- Conflict resolution strategies

### Progress System
- Point-based rewards
- Level progression
- Streak tracking
- Achievement badges

## App Store Preparation

### iOS Submission Checklist

1. **App Store Connect Setup**
   - Create app record
   - Configure app information
   - Set up pricing and availability

2. **Build Configuration**
   - Update `app.json` with production settings
   - Set proper bundle identifier
   - Configure app icons and splash screens

3. **Privacy and Permissions**
   - Camera usage description
   - Microphone usage description
   - Photo library access description

4. **Testing**
   - Test on multiple iPad models
   - Verify offline functionality
   - Test parent/child mode switching

5. **Metadata**
   - App description emphasizing educational value
   - Screenshots showing both interfaces
   - Keywords: education, autism, learning, children

### Build Commands

\`\`\`bash
# Build for iOS
expo build:ios

# Build for Android (future)
expo build:android
\`\`\`

## Customization

### Adding New Tasks
Tasks can be added through the parent dashboard or directly in the database:

\`\`\`sql
INSERT INTO tasks (title, description, target_object, difficulty, points_reward)
VALUES ('Find a Car', 'Look for something with wheels!', 'car', 1, 15);
\`\`\`

### Adjusting Difficulty
The app automatically adjusts task difficulty based on the child's level. Modify the algorithm in `DataContext.tsx`.

### Styling
The app uses a consistent design system. Colors and styles are defined in individual component files.

## Future Enhancements

- [ ] Advanced object detection with TensorFlow Lite
- [ ] Speech-to-text integration
- [ ] Cloud sync with parent web dashboard
- [ ] Social features (sharing achievements)
- [ ] Accessibility improvements
- [ ] Multi-language support

## Support

For technical support or feature requests, please create an issue in the repository.

## License

This project is licensed under the MIT License.
