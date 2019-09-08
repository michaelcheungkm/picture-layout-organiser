function createPostParams(jsonData) {
  const params = {
    method: 'POST',
    body: JSON.stringify(jsonData),
    headers: {
      'Content-Type':'application/json',
    }
  };
  return params;
}

export function getFormattedAddress(backendAddress) {
  if (!backendAddress.toLowerCase().startsWith('http://')
    && !backendAddress.toLowerCase().startsWith('https://')) {
    return 'http://' + backendAddress;
  } else if (backendAddress.toLowerCase().startsWith('https://')) {
    return 'http://' + backendAddress.substring(8, backendAddress.length);
  } else {
    return backendAddress;
  }
}

export function listUsers(backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/listUsers';

  fetch(query_url)
  .then(res => res.json())
  .then(callback);
}
