import React, {useState} from 'react'
import Payment from './Payment'
import CardPayment from './CardPayment'

const Offcanvas = (props) => {
  const {data} = props
  const [isClosed, setIsClosed] = useState(true)
  const handleClick = () => {
    setIsClosed(!isClosed)
  }
  return (
    <div>
      <button
        className="bg-blue-500 mb-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleClick}
        disabled={!isClosed}
      >
        Contribute
      </button>
      {!isClosed && (
        <div className="fixed inset-y-0 right-0 bg-white w-80 dark:bg-gray-800 p-4">
          <button
            className="absolute flex justify-center items-center top-0 right-1 text-lg w-6 h-6 text-center  mt-2 mr-2 hover:bg-slate-200 rounded-full"
            onClick={handleClick}
          >
            X
          </button>
          <h2 className="pt-20 text-lg italic">Contribute To</h2>
          <h3 className="mb-3 text-4xl font-extrabold">{data.title}</h3>
          <h4 className="mb-3 text-2xl text-gray-400 italic">
            {data.businessName}
          </h4>
          <Payment />
          <CardPayment accountId={data.accountId} />
        </div>
      )}
    </div>
  )
}

export default Offcanvas
