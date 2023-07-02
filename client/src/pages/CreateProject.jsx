import React, {useState} from 'react'
import axios from 'axios'
import {allRegions} from '../assets'
import {v4 as uuidv4} from 'uuid'

const CreateProject = () => {
  const [title, setTitle] = useState('')
  const [goalAmount, setgoalAmount] = useState(100)
  const [due, setDue] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Perform form submission logic here
    console.log('Submitted:', {
      title,
      goalAmount,
      due,
      location,
      description,
      selectedFile,
    })
    let fundraiserId = uuidv4()

    axios
      .post('http://localhost:3000/hedera/createFundraiser', {
        fundraiserId: fundraiserId,
      })
      .then(function (response) {
        // {fundraiserId, accountId, privateKey}
        console.log(response.data)
      })
      .catch(function (error) {
        console.error(error)
      })
  }
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="max-w-md mx-auto pt-48">
      <h1 className="text-2xl mb-3 font-bold text-center">
        Create New Campaign
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mr-2 ml-2"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Campaign Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter campaign title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="goal"
          >
            Goal Amount ($)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="goal"
            type="number"
            placeholder="Enter your Goal amount"
            value={goalAmount}
            onChange={(e) => setgoalAmount(e.target.value)}
            min="100"
            step="50"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <select
            className="shadow appearance-none border bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            {allRegions.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="due"
          >
            Due Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="walletaccount"
            type="date"
            placeholder="Enter your due date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            min={minDate}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter your project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="15"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="uploadImage"
          >
            Upload Project Image
          </label>
          <input
            type="file"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="uploadImage"
            accept="image/*"
            onChange={handleFileUpload}
            required
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProject
