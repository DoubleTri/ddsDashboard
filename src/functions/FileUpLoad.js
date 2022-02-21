//import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app'
import { fireStore, storage } from '../firebase';
import RandomId from '../functions/RandomId';

let len = 10;
let pattern = 'aA0'

let fileUpload = (dbKey, file, fileName, tags) => {

    console.log(dbKey, file, fileName, tags);
    //TODO: figure out if I'll use metadata below
    return new Promise((resolve, reject) => {
        let error = false

        var uploadTask = storage.ref().child('Hat Material_' + dbKey + '/' + file.name).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                    default:
                        console.log(progress);
                }
            }, function (error) {

                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;

                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;

                    default:
                        console.log(error.code);

                }
            }, function () {

                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at', downloadURL);
                    let id = RandomId(len, pattern);
                    fireStore.collection('users').doc(dbKey).collection('hattingMaterial').doc('hattingMaterial').update({
                        [fileName]: {
                            fileName: file.name,
                            title: fileName,
                            tags: tags,
                            id: fileName,
                            url: downloadURL,
                            type: 'hat material',
                            key: Math.floor(Math.random() * Math.floor(100000000)),
                            // checksheet: radioValue === 'yes' ? [] : false
                        }
                    })
                });
                if (!error) {
                    resolve('radioValue')
                } else {
                    reject(alert('unable to upload file'))
                }
            })

    });
}

export default fileUpload;