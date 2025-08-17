// car_image.js

const axios = require('axios');

async function getCarImageUrl(carModel) {
  // 1. .env 파일에서 두 개의 API 키를 모두 불러옵니다.
  const apiKey1 = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const apiKey2 = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY_2;

  // 2. 유효한 API 키만 필터링하여 배열에 저장합니다.
  //    (만약 키 하나가 비어있다면, 그 키는 사용하지 않습니다.)
  const apiKeys = [apiKey1, apiKey2].filter(key => key);

  // 사용할 수 있는 API 키가 하나도 없는 경우 오류를 처리합니다.
  if (apiKeys.length === 0) {
    console.error('오류: .env 파일에서 GOOGLE_CUSTOM_SEARCH_API_KEY를 찾을 수 없습니다.');
    return null;
  }

  // 3. 배열에서 랜덤으로 API 키 하나를 선택합니다.
  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  const selectedApiKey = apiKeys[randomIndex];
  
  // (선택 사항) 어떤 키를 사용했는지 확인하기 위한 로그
  console.log(`Google Search API Key ${randomIndex + 1}번을 사용하여 요청합니다.`);

  const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
  const searchQuery = `${carModel} side view`;
  const url = 'https://www.googleapis.com/customsearch/v1';

  try {
    const response = await axios.get(url, {
      params: {
        // 4. 랜덤으로 선택된 API 키를 요청에 사용합니다.
        key: selectedApiKey,
        cx: searchEngineId,
        q: searchQuery,
        searchType: 'image'
      }
    });

    const data = response.data;
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    } else {
      return null;
    }
  } catch (error) {
    console.error('API 요청 오류:', error.message);
    // API 키 할당량이 초과되었을 경우, 어떤 키에서 문제가 발생했는지 알려줍니다.
    if (error.response && error.response.data) {
        console.error('API 응답:', error.response.data.error.message);
    }
    return null;
  }
}

module.exports = getCarImageUrl;