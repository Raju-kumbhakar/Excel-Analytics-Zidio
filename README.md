## Admin Panel Persistence (MongoDB)

Admin Panel state is now persisted in MongoDB via a singleton document `admin_state` (see `server/models/AdminState.js`).

Endpoints (protected by `x-admin-auth` header matching `ADMIN_API_KEY`):

- GET `/api/admin/state`
  - Returns the current admin state.
- PUT `/api/admin/state`
  - Upserts any of the following keys in the state body:
    - `adminsActive: string[]`
    - `adminsPending: string[]`
    - `adminsRejected: string[]`
    - `userAdminFlags: { [email]: { active: boolean, spam: boolean } }`
    - `sysMaintenance: boolean`
    - `sysMaintenanceUntil: Date | null`
    - `sysAlert: string`
    - `sysUploadLimit: number`
- POST `/api/admin/ensure-admin-user`
  - Body: `{ email }`
  - Ensures the email exists as a user with `role='admin'` (creates with a random password if missing).

Example with PowerShell curl:

```powershell
$headers = @{ "Content-Type" = "application/json"; "x-admin-auth" = "dev-admin-key" }
curl -Method GET  -Uri http://localhost:5000/api/admin/state -Headers $headers
curl -Method PUT  -Uri http://localhost:5000/api/admin/state -Headers $headers -Body '{"sysAlert":"Hello"}'
```

## Superadmin Account

On server start, a superadmin is seeded if absent:

- Email: `superadmin@excelanalytics.app`
- Password: `ChangeMe123!`

You can override via environment variables in `server/.env`:

```
SUPERADMIN_EMAIL=superadmin@excelanalytics.app
SUPERADMIN_PASSWORD=ChangeMe123!
ADMIN_API_KEY=dev-admin-key
```

Change these in production. The admin routes require the `x-admin-auth` header to match `ADMIN_API_KEY`.

## Collections

- `users` – registered users and OTP-created accounts
- `otpcodes` – issued OTP codes
- `admin_state` – Admin Panel persisted state

# 📊 Excel Analytics Platform - Frontend

A modern, responsive React application for Excel file analytics with beautiful dark glassmorphism design. This platform allows users to upload Excel files, configure chart settings, and provides an admin panel for user management.

## 🚀 Features

### ✨ User Features
- **Modern Dark UI**: Beautiful glassmorphism design with gradients and animations
- **File Upload**: Drag & drop Excel file upload with visual feedback
- **Chart Configuration**: 2D/3D chart type selection with icons
- **Data Mapping**: X/Y axis selection for chart generation
- **Upload History**: Track uploaded files and their statistics
- **User Profile**: View account information and activity history
- **Feedback System**: Submit bug reports and suggestions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🔐 Authentication
- **User Registration**: Email/password registration with OTP verification
- **Admin Registration**: Special admin registration with passkey (`ADMIN2024`)
- **Login System**: Secure login with forgot password functionality
- **Role-Based Access**: Separate user and admin experiences

### 👨‍💼 Admin Features
- **Dashboard Overview**: System statistics and analytics
- **User Management**: View and manage user accounts
- **File Analytics**: Track file uploads and usage
- **Chart Analytics**: Monitor chart generation statistics
- **System Settings**: Configure platform settings
- **Feedback Management**: Review and respond to user feedback
- **Support Tools**: Comprehensive admin tools

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **LocalStorage**: Client-side data persistence
- **Responsive Design**: Mobile-first approach

### Design System
- **Dark Mode**: Consistent dark theme throughout
- **Glassmorphism**: Translucent, blurred UI elements
- **Gradients**: Beautiful color transitions
- **Animations**: Smooth transitions and hover effects
- **Icons**: Emoji and SVG icons for better UX

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.js          # User login with OTP verification
│   │   └── Register.js       # User/admin registration
│   └── Common/
│       ├── Navbar.js         # Global navigation with role-based links
│       └── ProtectedRoute.js # Route protection component
├── pages/
│   ├── Landing.js            # Landing page with platform info
│   ├── UserDashboard.js      # Main user dashboard
│   ├── AdminPanel.js         # Admin panel with sidebar navigation
│   └── Dashboard.js          # Wrapper component (legacy)
├── App.js                    # Main app with routing
└── index.js                  # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3001`
   - The app will automatically reload when you make changes

### Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

## 🎯 How to Use

### For Users
1. **Register/Login**: Create an account or login with existing credentials
2. **Upload Files**: Drag & drop Excel files or click to browse
3. **Configure Charts**: Select 2D/3D dimensions and chart types
4. **Map Data**: Choose X and Y axes for your charts
5. **Create Charts**: Generate charts (placeholder for now)
6. **View History**: Check your upload history and statistics

### For Admins
1. **Admin Registration**: Use passkey `ADMIN2024` during registration
2. **Access Admin Panel**: Navigate to admin dashboard
3. **Manage Users**: View and manage user accounts
4. **Monitor Analytics**: Track system usage and statistics
5. **Review Feedback**: Handle user feedback and bug reports

## 🔧 Configuration

### Admin Passkey
The admin registration passkey is set to `ADMIN2024`. You can change this in:
```javascript
// src/components/Auth/Register.js
const ADMIN_PASSKEY = 'ADMIN2024';
```

### OTP System
The OTP system is currently frontend-only for demonstration:
- OTPs are generated randomly
- Visible on screen for testing purposes
- In production, integrate with email service

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Key responsive features:
- Collapsible navigation menu
- Flexible grid layouts
- Touch-friendly buttons
- Optimized text sizes

## 🎨 Customization

### Colors
The app uses a consistent color palette defined in Tailwind classes:
- **Primary**: Blue gradients (`from-blue-600 to-purple-700`)
- **Success**: Green (`green-500`, `green-600`)
- **Warning**: Yellow (`yellow-400`)
- **Error**: Red (`red-400`, `red-600`)

### Styling
All components use Tailwind CSS classes for consistent styling:
- Glassmorphism effects: `backdrop-blur-xl bg-white/10`
- Gradients: `bg-gradient-to-r from-blue-600 to-purple-700`
- Animations: `transition-all duration-200`

## 🔮 Future Development

### Backend Integration
To add backend functionality:

1. **API Integration**
   ```javascript
   // Replace localStorage with API calls
   const response = await fetch('/api/upload', {
     method: 'POST',
     body: formData
   });
   ```

2. **Real Chart Generation**
   ```javascript
   // Integrate with chart libraries
   import { Chart } from 'chart.js';
   import { Bar, Line, Pie } from 'react-chartjs-2';
   ```

3. **Email Service**
   ```javascript
   // Add real OTP email service
   const sendOTP = async (email) => {
     // Integrate with SendGrid, AWS SES, etc.
   };
   ```

### Recommended Next Steps
1. **Backend API**: Create Node.js/Express or Python/Django backend
2. **Database**: Add PostgreSQL or MongoDB for data persistence
3. **File Processing**: Implement real Excel parsing with `xlsx` library
4. **Chart Generation**: Add actual chart rendering with Chart.js
5. **Email Service**: Integrate email verification system
6. **Authentication**: Add JWT tokens and session management
7. **File Storage**: Add cloud storage (AWS S3, Google Cloud)
8. **Real-time Features**: Add WebSocket for live updates

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3001
   npx kill-port 3001
   ```

2. **Module Not Found**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Tailwind CSS Not Working**
   - Check that Tailwind CDN is loaded in `public/index.html`
   - Verify CSS classes are properly applied

### Development Tips

1. **Check Console**: Always check browser console for errors
2. **LocalStorage**: Use browser dev tools to inspect localStorage data
3. **Responsive Testing**: Test on different screen sizes
4. **Component Structure**: Follow the established component hierarchy

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Coding! 🚀**

*This project demonstrates modern React development practices with a focus on user experience and maintainable code structure.*
