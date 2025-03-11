import React from 'react';
import { X } from 'lucide-react';

interface Payment {
  _id: string;
  userId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  createdAt: string;
}

interface UserDetails {
  userId: string;
  name: string;
  email: string;
  credits: number;
  totalPayments: number;
  payments: Payment[];
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: UserDetails;
}

function UserDetailsModal({ isOpen, onClose, userDetails }: UserDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium">{userDetails.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{userDetails.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Credits</p>
              <p className="text-lg font-medium">{userDetails.credits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-lg font-medium">₹{userDetails.totalPayments}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment History</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userDetails.payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.paymentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;