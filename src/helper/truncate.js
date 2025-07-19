
const truncateAddress = (address) => {
  return address.slice(0, 7) + '...' + address.slice(address.length - 5)
}

export default truncateAddress