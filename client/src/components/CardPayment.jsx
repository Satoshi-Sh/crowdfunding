import React, {useState} from 'react'
import axios from 'axios'

const CardPayment = ({accountId}) => {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cvv: '',
    expiryMonth: '',
    expiryYear: '',
    fullName: '',
    addressLine1: '',
    countryCode: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submit:', formData)
  }
  return (
    <>
      <button
        className="bg-teal-400 mt-20 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => setShowModal(true)}
      >
        Open Card Payment
      </button>

      {showModal && (
        <>
          <div className="justify-center items-center mb-5 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto top-44 my-6 mx-auto max-w-3xl">
              {/* Content */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Card Info</h3>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>

                {/* Body */}
                <div className="relative p-6 flex-auto">
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white outline-none rounded px-8 pt-6 pb-8  mr-2 ml-2"
                  >
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="cardNumber"
                      >
                        Card Number
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="cardNumber"
                        id="cardNumber"
                        type="text"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="cvv"
                      >
                        CVV
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="cvv"
                        id="cvv"
                        type="text"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="expiryMonth"
                      >
                        Expiry Month
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="expiryMonth"
                        id="expiryMonth"
                        type="text"
                        placeholder="Expiry Month 02"
                        value={formData.expiryMonth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="expiryYear"
                      >
                        Expiry Year
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="expiryYear"
                        id="expiryYear"
                        type="text"
                        placeholder="Expiry Year 2030"
                        value={formData.expiryYear}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="fullName"
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="addressLine1"
                      >
                        Address Line 1
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="addressLine1"
                        id="addressLine1"
                        type="text"
                        placeholder="Address Line 1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="countryCode"
                      >
                        Country Code
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="countryCode"
                        id="countryCode"
                        type="text"
                        placeholder="Country Code"
                        value={formData.countryCode}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="city"
                      >
                        City
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="city"
                        id="city"
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="state"
                      >
                        State
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="state"
                        id="state"
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="postalCode"
                      >
                        Postal Code
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="postalCode"
                        id="postalCode"
                        type="text"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="email"
                        id="email"
                        type="text"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  )
}

export default CardPayment
