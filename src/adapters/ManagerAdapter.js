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

export function getUserContent(username, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/' + username + '/getUserContent';
  fetch(query_url)
  .then(res => res.json())
  .then(callback);
}

export function saveUserContent(username, content, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/' + username + '/saveUserContent';
  var postParams = createPostParams({'content': content});
  fetch(query_url, postParams)
    .then(callback);
}

export function loadAllAndGetUserContent(username, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/' + username + '/loadAllAndGetUserContent';
  fetch(query_url)
  .then(res => res.json())
  .then(callback);
}

export function createAccount(newName, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/createAccount';
  var postParams = createPostParams({'name': newName});
  fetch(query_url, postParams)
    .then(callback);
}
