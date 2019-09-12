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

export function createAccount(newName, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/createAccount';
  const postParams = createPostParams({'name': newName});
  fetch(query_url, postParams)
    .then(callback);
}

export function uploadUserImages(files, username, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/' + username + '/addUserImages';
  const formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    formData.append('file', files[i]);
  }

  const params = {
    method: 'POST',
    body: formData
  };

  var success;
  fetch(query_url, params)
    .then(res => {success = res.ok; return res})
    .then(res => res.text())
    .then(res=> callback({'ok': success, 'text': res}))

}
