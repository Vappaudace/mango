# **App Name**: MANGO

## Core Features:

- User Authentication & Onboarding: Secure sign-up and login functionality with support for email/password, Google, and Apple providers. Includes a guided onboarding flow for initial profile creation and primary photo upload.
- Dynamic Profile Management: Users can create, view, and edit comprehensive profiles, including multiple photos, personal bio, interests, age, gender, desired partners, and location. Integrated with Firebase Storage for media management and Firestore for data.
- Interactive Discovery Feed: A fluid card-swiping interface allowing users to explore potential matches based on predefined filters (distance, age, etc.). Supports 'Pass' (left swipe), 'Like' (right swipe), and 'Super Like' actions.
- Real-time 'Mûr!' Match System: Instantly notifies users with engaging animations when a mutual 'Like' creates a 'Mûr!' (match). This system creates a dedicated record for each new match within Firestore.
- 'Jus' Real-time Chat: Enables seamless real-time messaging between matched users, featuring dynamic chat bubbles, typing indicators, and a conversation history managed in Firestore for direct communication.
- Geolocation-based Matching: Leverages user location data (GeoPoint in Firestore) to display distance to other profiles and allow filtering of discovery results by a specified radius, enhancing local connection opportunities.
- AI Icebreaker Tool: An AI-powered tool providing personalized conversation starters ('Jus') for new 'Mûr!' matches, intelligently crafting suggestions based on the matched user's profile interests and bio to facilitate connections.

## Style Guidelines:

- Primary Color: A vibrant and warm orange (#FFB300), chosen for its energetic and tropical association with 'MANGO', serving as the core interactive color for CTAs and highlights.
- Background Color: A deep, desaturated warm brown/orange (#201A0E), harmoniously derived from the primary hue to establish a sophisticated and comfortable dark mode foundation.
- Accent Color: A rich, dark reddish-orange (#843A1F). This analogous shade provides a contrasting depth, used for secondary elements and subtle visual cues that complement the primary vibrancy.
- Thematic Contrast: A bright, lively leaf green (#5DB800), incorporated as a vibrant accent for branding elements (like the mango leaf logo) and illustrative animations, offering a fresh counterpoint to the dominant oranges.
- Neutral Palette: Pristine white (#FFFFFF) for text readability and key informational elements on dark backgrounds, complemented by deep charcoal (#0D0D0D) and a warm dark brown (#1A0A00) for varied background layers and gradients.
- Headline Font: 'Playfair Display' (serif), chosen for its elegant and impactful presence, perfect for titles and emphasized text, conveying a blend of tradition and modern flair.
- Body Font: 'DM Sans' (sans-serif), selected for its contemporary, clean, and highly legible characteristics, ensuring optimal readability across all informational and conversational content.
- Card Elements: Generously rounded corners (`28px`) define the aesthetic of profile cards, imbuing a soft, approachable, and modern feel for the primary discovery experience.
- Interactive Components: A consistent application of softened, rounded corners (`18-20px` for buttons, `16px` for inputs) ensures user interaction elements are inviting and unified in design.
- User Avatars: Emphasized with perfect circularity (`50%` border-radius), making user profiles feel personal, immediate, and distinct within the UI.
- Branded & Thematic Icons: Custom-designed mango SVG graphics, localized flag badges, and fruit-themed animation assets directly reinforcing the 'MANGO' branding and its unique vocabulary ('Mûr', 'Jus').
- Engaging Dynamic Feedback: Rich, personality-infused animations for the app's splash screen logo, celebratory match alerts ('Mûr!'), playful no-match reactions ('Pas Mûr...'), and fluid UI transitions during interactions.