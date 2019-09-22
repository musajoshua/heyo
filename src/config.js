import firebase from 'firebase';
import uuid from 'uuid';

class FirebaseSvc {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyD8kixFCheduLMZV9X8bgUy6trl_KCzEQE",
                authDomain: "sammy-62d63.firebaseapp.com",
                databaseURL: "https://sammy-62d63.firebaseio.com",
                projectId: "sammy-62d63",
                storageBucket: "sammy-62d63.appspot.com",
                messagingSenderId: "41195106461"
            });
        }
    }
    login = async (user, success_callback, failed_callback) => {
        await firebase.auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then(async(val) =>{
                const { uid } = val.user;
                const user = await firebase.database().ref('/users/' + uid).once('value', val => this.parseUser(val));
                success_callback(user)
            }, failed_callback);
    }

    createAccount = async (user,callback) => {
        await firebase.auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(function (response) {
            id = firebase.auth().currentUser.uid;
            firebase.database().ref('users/' + id).set(user);
            var userf = firebase.auth().currentUser;
            userf.updateProfile({user})
            .then(callback({status:true}))
        }, function (error) {
                callback(error);
        }, function (error) {
            alert("Create account failed.");
        });
    }
    
    editAccount = async(user,callback) => {
        let new_uri = await this.uploadProfile(user.avatar, user.uid);
        user.avatar = new_uri;
        firebase.database().ref('users/' + user.uid).set(user);
        var userf = firebase.auth().currentUser;
        userf.updateProfile({user})
        .then(callback({status:true}));
    }

    findByEmailOff = () => {
        firebase.database().ref('/users').off('child_added');
    }

    getLastMessage = async (user_1_id, user_2_id) => {
        let id = this.combine_id(user_1_id, user_2_id);
        return firebase.database().ref("/chats/" + id).limitToLast(1).once("child_added");
        
    }

    findByEmail = async (user, callback) => {
        firebase.database().ref('/users').once('value', (snapshot) => {
            let users = [];
            snapshot.forEach(childNode => {
                let response = this.parseUser(childNode);
                 if (response.email == user.email) {
                    users.push(response);
                }
            });
            callback(users);
        });
    }

    retreive = async(user_1_id, user_2_id, callback) => {
        let id = this.combine_id(user_1_id, user_2_id);
        await firebase.database().ref('/chats/' + id).on('child_added', (snapshot) => {
            // snapshot => callback(this.parse(snapshot))
            // console.warn(snapshot)
            if(snapshot){
                callback(this.parse(snapshot))
            }else{
                callback([])
            }
        });
    }

    uploadProfile = async (uri,id) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const ref = firebase
            .storage()
            .ref()
            .child(id);
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();

        return await snapshot.ref.getDownloadURL();
    }

    uploadFile= async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const ref = firebase
            .storage()
            .ref()
            .child(uuid.v4());
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();

        return await snapshot.ref.getDownloadURL();
    }

    retreiveAllContacts = async(uid, callback) => {
        await firebase.database().ref('/chats').on('value', snapshot => callback(this.parseAllContacts(uid, snapshot))); 
    }

    retreiveMyUser = async(uid, callback) => {
        await firebase.database().ref('/users/' + uid).on('child_added', val => callback(this.parseUser(val)))
    }

    parseAllContacts = async(uid, snapshot = []) => {
        const my_contacts = [];
        snapshot.forEach(childNode => {
            if (childNode.key.includes(uid)) {
                newid = childNode.key.replace(uid,"");
                my_contacts.push(newid)
            }
        });
        return my_contacts;
        
    }

    findUserById = (id, callback) => {
        firebase.database().ref('/users/' + id).once('value', val => callback(this.parseUser(val)))
    }

    parseUser = snapshot => {
        let contact = {};
        uid = snapshot.key;
        const { name, avatar,email, username} = snapshot.val();
        contact = { name, avatar, uid, email, username};
        return contact;
    }

    parse = snapshot => {
        mes = [];
        const { _id, createdAt: numberStamp, text, user, image, file} = snapshot.val();
        const createdAt = new Date(numberStamp);
        const message = { _id, createdAt, text, user, image, file};
        mes.push(message);
        return mes;
    };

    openConversation = async(user_1_id, user_2_id, message) => {
        let id = this.combine_id(user_1_id, user_2_id);
        await firebase.database().ref('/chats/' + id).push(message);
    }

    combine_id = (user_1_id, user_2_id) => {
        if (user_1_id > user_2_id) {
            return user_1_id + user_2_id;
        } else {
            return user_2_id + user_1_id;
        }
    }    
}
const firebaseSvc = new FirebaseSvc();
firebaseSvc.getLastMessage();
export default firebaseSvc;