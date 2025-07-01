export default function InvoiceHeader() {
  return (
    <div className="text-center border-b-2 border-black pb-4 mb-6">
      <h1 className="text-3xl font-bold text-black">ACC MOTORS</h1>
      <p className="text-lg text-gray-800">Service Center</p>
      <div className="mt-2 text-sm text-gray-700">
        <p>Dehiattakandiya</p>
        <p>Tel: +94 76 234 5678 | Email: info@accmotors.lk</p>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-black">SERVICE INVOICE</h2>
      </div>
    </div>
  )
}