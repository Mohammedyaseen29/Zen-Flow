
    export default function VerifyRequest() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Check your email</h1>
            <p className="text-gray-600 mb-6">
            A sign in link has been sent to your email address.
            </p>
            <p className="text-gray-600">
            If you don't see it, check your spam folder.
            </p>
        </div>
        </div>
    );
    }
