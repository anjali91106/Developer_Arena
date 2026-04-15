import BackButton from '../components/BackButton';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About BlogSpace</h1>
              <p className="text-gray-600">Learn more about our blogging platform</p>
            </div>
            <BackButton />
          </div>
        </div>

        {/* About Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to BlogSpace</h2>
            <p className="text-gray-600 mb-4">
              BlogSpace is a modern, user-friendly blogging platform designed to help you share your thoughts, stories, and ideas with the world. Built with cutting-edge technology and a beautiful, intuitive interface.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              To provide a creative space where writers, developers, and thinkers can express themselves freely while connecting with a community that values authentic voices and meaningful conversations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">✓</span>
                <span>Create and manage blog posts with rich text formatting</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">✓</span>
                <span>Engage with posts through likes and comments</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">✓</span>
                <span>Connect with other writers and build your network</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">✓</span>
                <span>Search and discover content that matters to you</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">✓</span>
                <span>Beautiful, responsive design that works on any device</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology</h3>
            <p className="text-gray-600 mb-4">
              Built with React for the frontend, Node.js and Express for the backend, and MongoDB for data storage. Our platform uses modern web technologies to ensure fast, reliable performance and a smooth user experience.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Security & Privacy</h3>
            <p className="text-gray-600 mb-4">
              We take your privacy seriously. All personal data is encrypted and stored securely. We use industry-standard authentication practices and never share your information with third parties without your explicit consent.
            </p>
          </div>

          {/* Privacy Policy Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Policy</h3>
            <div className="space-y-4 text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Information We Collect</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (username, email, profile data)</li>
                  <li>Blog posts and comments you create</li>
                  <li>Usage data to improve our services</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How We Use Your Information</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To provide and maintain the blogging platform</li>
                  <li>To authenticate users and secure accounts</li>
                  <li>To personalize your experience and show relevant content</li>
                  <li>To analyze usage patterns and improve our services</li>
                  <li>To communicate with you about updates and support</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Data Protection</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All data is encrypted in transit and at rest</li>
                  <li>Access is controlled through secure authentication</li>
                  <li>Regular security audits and updates</li>
                  <li>You can request data deletion at any time</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Your Rights</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Control your privacy settings</li>
                  <li>Export your data at any time</li>
                  <li>Delete your account and associated data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
