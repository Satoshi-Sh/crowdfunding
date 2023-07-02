import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {sampleData} from '../assets'
import {Offcanvas} from '../components'
import axios from 'axios'

const SingleProject = () => {
  const {id} = useParams()
  const [currentAmount, setCurrentAmount] = useState()

  useEffect(() => {
    try {
      axios
        .get(`http://localhost:3001/hedera/balance/${data.accountId}`)
        .then(function (response) {
          setCurrentAmount(response.data)
        })
        .catch(function (error) {
          console.error(error)
        })
    } catch (error) {
      console.error(error)
    }
  }, [])

  const data = sampleData.find((item) => item.id === Number(id))

  return (
    <div className="pt-12 text-center">
      <h1 className="pt-20 mb-3 text-4xl font-extrabold">{data.title}</h1>
      <h2 className="mb-3 text-2xl text-gray-400 italic">
        {data.businessName}
      </h2>
      <div className="flex flex-row justify-center p-5">
        <img
          src={data.image}
          alt="project header"
          className="max-h-96 shadow-md"
        ></img>
      </div>
      <p className="max-w-lg p-3 mx-auto">{data.description}</p>
      <div className="flex flex-row justify-evenly p-10">
        <span className="text-gray-700 text-lg italic">
          Current: ${currentAmount ? currentAmount.usd : ''}
        </span>
        <span className="text-gray-700 italic text-lg">
          Goal: ${data.goalAmount}
        </span>
      </div>
      <div className="flex flex-row justify-center p-10">
        <span className="text-gray-700 text-lg italic">
          Public ID: {data.accountId}
        </span>
      </div>
      <div className="flex flex-row justify-between p-10">
        <span className="text-gray-700 italic">Due: {data.due}</span>
        <span className="text-gray-700 italic">{data.location}</span>
      </div>

      <Offcanvas data={data} />
    </div>
  )
}

export default SingleProject
