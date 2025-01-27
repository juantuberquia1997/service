function setAccountInfoResponse(response: any) {
  if (response.errorCode == 400006) {
    console.log('error', response)
  }
  if (response.errorCode == 0) {
    console.log('success', response)
  }
}
let params = {
  data: { "QRCODES": [{ "QR": "123456789" }] },

  callback: setAccountInfoResponse,
}
window.gigya.accounts.setAccountInfo(params)


const handleGetAccountInfoResponse = (response: any) => {
  console.log(response)
}
window.gigya.accounts.getAccountInfo({
  callback: handleGetAccountInfoResponse,
})