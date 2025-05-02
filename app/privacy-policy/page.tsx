'use client';

import Link from 'next/link';
import { Container } from '../components/ui/Container';

export default function PrivacyPolicy() {
  return (
    <Container className="max-w-7xl">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--main-text-color)] mb-4">Privacy Policy</h1>
        <div className="w-24 h-1 bg-[var(--main-bg-color)] mx-auto rounded-full"></div>
      </div>
      
      {/* Privacy Features Highlight Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8 mb-10 transition-all hover:shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--main-bg-color)] bg-opacity-20 dark:bg-opacity-40 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--main-text-color)] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--main-text-color)]">Privacy by Design</h2>
        </div>
        
        <div className="pl-3 sm:pl-14">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
            This application was designed with privacy at its core. Unlike most web services, your personal relationship data stays completely private.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-xl transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-[var(--main-text-color)]">100% Local Processing</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-3 sm:ml-11">
                All menu data is processed and stored entirely within your browser using local storage. Nothing about your relationship preferences is ever transmitted to any servers.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-xl transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-[var(--main-text-color)]">No Tracking Cookies</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-3 sm:ml-11">
                No cookies are used to track your behavior or preferences. Your browsing remains private to you.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50/70 dark:bg-blue-900/20 border-l-4 border-blue-300 dark:border-blue-700 p-4 sm:p-6 rounded-r-xl mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="flex-shrink-0 mr-3 mb-2 sm:mb-0 sm:mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-blue-700 dark:text-blue-400">Sharing Your Menu with Others</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  There are two ways to share your relationship menu with others, both designed with your privacy in mind:
                </p>
                
                <div className="mt-4 space-y-4">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Exporting as PDF
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm ml-3 sm:ml-6 mb-2">
                      Export your menu as a beautifully formatted PDF document that's ready for printing or sharing.
                      The exported PDF file can be opened on any device with a PDF viewer and be edited on this website.
                      <b>This is the recommended method for sharing your menu.</b>
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Downloading as JSON File
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm ml-3 sm:ml-6 mb-2">
                      Download your menu as a JSON file. If you don't know what that means this likely isn't for you.
                      Can be used to put the menu into a git repository or other version control system.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Sharing via URL
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm ml-3 sm:ml-6">
                      When sharing your menu via a link, all your data is encoded within the URL itself. 
                      The recipient can simply click the link to view your menu without downloading any files.
                    </p>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">Privacy Benefits of All Sharing Methods</h4>
                <ul className="list-disc ml-3 sm:ml-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Your personal data remains on your device until you explicitly choose to share it</li>
                  <li>No menu information is ever stored in external databases or transmitted to servers</li>
                  <li>You maintain absolute control over who can access your relationship preferences</li>
                </ul>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="bg-green-50/50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1">PDF Advantages</h5>
                    <ul className="list-disc ml-4 sm:ml-5 text-sm text-gray-700 dark:text-gray-300">
                      <li>Professional presentation</li>
                      <li>Ready for printing</li>
                      <li>Widely compatible format</li>
                      <li>Contains json menu data</li>
                      <li>Editable on this website</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50/50 dark:bg-purple-900/20 p-2 rounded-lg border border-purple-100 dark:border-purple-800  ">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1">URL Sharing Advantages</h5>
                    <ul className="list-disc ml-4 sm:ml-5 text-sm text-gray-700 dark:text-gray-300">
                      <li>One-click access for recipients</li>
                      <li>No file handling required</li>
                      <li>Works on any device with a browser</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800 ">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1">JSON File Advantages</h5>
                    <ul className="list-disc ml-4 sm:ml-5 text-sm text-gray-700 dark:text-gray-300">
                      <li>Permanent offline storage</li>
                      <li>Easy backup and archiving</li>
                      <li>Version control possibilities</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-3">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Privacy vs. Convenience Tradeoff
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm ml-3 sm:ml-6">
                    While URL-encoded menus result in very long links, this approach was deliberately chosen to prioritize your privacy. 
                    By embedding data in the URL rather than storing it in a database, your personal relationship preferences remain 
                    private and under your control at all times. However, PDF files are currently recommended for sharing as long
                    links can break easily in some apps.
                  </p>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  <b>Privacy Advisory:</b> Because your menu data is embedded directly in the shared URL, only share your unique link through secure channels and exclusively with trusted individuals you want to grant access to your relationship menu.
                </p>
                
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mt-4 border border-blue-100 dark:border-blue-800">
                  <h4 className="text-lg font-medium mb-2 text-blue-600 dark:text-blue-400">How URL Fragment Encoding Works</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    The application uses URL fragments (the part after the # symbol) rather than query parameters (the part after the ? symbol) to encode your menu data in a link. This technical choice provides enhanced privacy:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="font-medium text-red-600 dark:text-red-400">Query Parameters (?)</p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        <code className="bg-red-100 dark:bg-red-900/40 px-1 py-0.5 rounded">example.com?data=12345</code>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                        The data parameter is sent to the server during the request to load the page, potentially allowing the server to store your data.
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="font-medium text-green-600 dark:text-green-400">URL Fragments (#)</p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        <code className="bg-green-100 dark:bg-green-900/40 px-1 py-0.5 rounded">example.com#data=12345</code>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                        The data parameter stays in your browser and is not sent to the server, keeping your data private and on your device.
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    When you share a URL with a fragment, only the part before the # is sent to the server. The fragment containing your menu data is processed entirely by your browser after the page loads, ensuring your relationship preferences remain private.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legal Requirements Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8 mb-10 transition-all hover:shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--main-bg-color)] bg-opacity-20 dark:bg-opacity-40 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--main-text-color)] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--main-text-color)]">Legal Requirements</h2>
        </div>
        
        <div className="pl-3 sm:pl-14 space-y-8">
          {/* Contact Information Section */}
          <div>
            <h3 className="text-xl font-medium mb-6 text-[var(--main-text-color)]">1. General information and mandatory information</h3>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-xl">
              <div className="flex items-center border-b border-gray-200 dark:border-gray-600 pb-4 mb-6">
                <h4 className="text-lg font-bold text-[var(--main-text-color)]">Data Controller Information</h4>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="mb-6 md:mb-0 md:pr-6 md:w-1/2">
                  <p className="font-medium text-lg text-[var(--main-text-color)] mb-2">Address</p>
                  <p className="mb-1 dark:text-gray-300">Paul-Vincent Roll</p>
                  <p className="mb-1 dark:text-gray-300">Gürtelstraße 13</p>
                  <p className="mb-1 dark:text-gray-300">13088 Berlin</p>
                  <p className="dark:text-gray-300">Germany</p>
                </div>
                
                <div className="md:border-l border-gray-200 dark:border-gray-600 md:pl-6 md:w-1/2">
                  <p className="font-medium text-lg text-[var(--main-text-color)] mb-2">Contact</p>
                  <p className="flex items-center mb-3 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +49 173 1626294
                  </p>
                  <p className="flex items-center dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    paul-vincent@relationshipmenu.org
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  The responsible party is the natural or legal person who alone or jointly with others decides on the purposes and means of processing personal data (names, email addresses, etc.).
                </p>
              </div>
            </div>
          </div>
          
          {/* Server Log Files Section */}
          <div>
            <h3 className="text-xl font-medium mb-3 text-[var(--main-text-color)]">2. Data collection on this website</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-xl">
              <h4 className="text-lg font-medium mb-3 text-[var(--main-text-color)]">2.1. Server log files</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Each time the website is accessed, information that your browser transmits is automatically collected and stored in "server log files".
              </p>
              
              <div className="bg-white dark:bg-gray-600 p-4 rounded-lg border border-gray-200 dark:border-gray-500 mb-4">
                <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">These log files include:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <ul className="list-disc ml-4 sm:ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Your IP address</li>
                    <li>Host name of the accessing computer</li>
                    <li>Duration of the request</li>
                    <li>Time of the server request</li>
                    <li>First Line of Request (what is requested)</li>
                    <li>Status of the request</li>
                  </ul>
                  <ul className="list-disc ml-4 sm:ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Transmitted data (volume)</li>
                    <li>Useragent</li>
                    <li>Browser type and browser version</li>
                    <li>Operating system used</li>
                    <li>Referrer URL</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                The basis for data processing is Art. 6 (1) (f) GDPR, which allows the processing of data to fulfill a contract or for measures preliminary to a contract.
              </p>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-r-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This data will be stored for fourteen days and not be merged with other data sources.
                </p>
              </div>
            </div>
          </div>
          
          {/* Third Party Section */}
          <div>
            <h3 className="text-xl font-medium mb-3 text-[var(--main-text-color)]">3. Data processing by third party providers</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-500 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-[var(--main-text-color)]">phasedrei</h4>
              </div>
              
              <div className="ml-3 sm:ml-11 space-y-3">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This website uses <a href="https://phasedrei.de" className="text-[var(--main-text-color)] hover:underline" target="_blank" rel="noopener noreferrer">phasedrei</a>, Richard-Wagner-Ring 2E, 67227 Frankenthal (Pfalz) as the hosting provider.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The collected data mentioned in Section 2 is processed and stored on servers provided by phasedrei.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  A data processing agreement with phasedrei has been established for the outsourcing of data processing, fully implementing the strict requirements of the German data protection authorities when using phasedrei's services.
                </p>
                
                <div className="flex items-center bg-white dark:bg-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    The privacy policy of phasedrei can be found at: <a href="https://phasedrei.de/datenschutz/" className="text-[var(--main-text-color)] hover:underline break-words" target="_blank" rel="noopener noreferrer">https://phasedrei.de/datenschutz/</a>
                  </p>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  The use of phasedrei is based on legitimate interest (per Art. 6 (1) p. 1 lit. f GDPR) in the efficient and secure hosting of this website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8 sm:mt-12 mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center px-4 sm:px-6 py-3 bg-[var(--main-text-color)] text-white rounded-lg hover:bg-[var(--main-text-color-hover)] transition-colors shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </Container>
  );
} 