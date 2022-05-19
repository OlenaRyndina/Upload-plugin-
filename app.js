import {upload} from './upload.js';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBAW5-IHp1Qum6PVfGQHZxVzl96MI1thjQ",
  authDomain: "fe-upload-8c86f.firebaseapp.com",
  projectId: "fe-upload-8c86f",
  storageBucket: "fe-upload-8c86f.appspot.com",
  messagingSenderId: "592118936865",
  appId: "1:592118936865:web:81222247453b446174ba60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();

upload('#file', {
	multi: true,
	accept: ['.png', '.jpg', '.jpeg', '.gif'],
	onUpload(files, blocks) {
		files.forEach((file, index) => {
			const reference = ref(storage, `images/${file.name}`);
			const task = uploadBytesResumable(reference, file);
			const block = blocks[index].querySelector('.preview-info-progress');

			task.on('state_changed', snapshot => {
          const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)  + '%';
          block.textContent = percentage;
          block.style.width = percentage;
			}, error => {
				console.log(error);
			}, () => {
				block.textContent = 'Загрузка завершена';
				    
				getDownloadURL(ref(storage, `images/${file.name}`))
				.then(url => {
					console.log('Download URL', url);
					setTimeout(() => {
					  const imgLink = document.createElement('a');
					  imgLink.setAttribute('href', url);
					  imgLink.setAttribute('target', '_blank');
					  imgLink.textContent = 'Скачать';
					  block.innerHTML = '';
					  block.insertAdjacentElement('beforeend', imgLink);            
				  }, 3000)					
				})
			})
		})
	}
});
