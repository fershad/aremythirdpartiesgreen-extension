// console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {

  // if (request.type === 'COUNT') {
  //   console.log('background has received a message from popup, and count is ', request?.count)
  // }
  if (request.type === 'resource') {
    console.log('background has received a message from popup, and resources is ', request?.resourceUrls)
  }
  if (request.type === 'filtered') {
    console.log('background has received a message from popup, and filtered is ', request?.filteredUrls)
  }
})
