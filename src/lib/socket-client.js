import io from 'socket.io-client'
import asyncStorage from './async-storage'

const chatServer = {
	url: 'https://localhost',
	port: 4433
}

class SocketClient {

	/**
	 * class constructor
	 */
	constructor (url, port, event){
		this.url = url || chatServer.url
		this.port = port || chatServer.port
		this.event = event || 'connect'
		this.setSocket()
		//return this.connect()
		/*this.socket = io(this.url + ':' + this.port, { query: { token: asyncStorage.token }})

		return new Promise(resolve => {
			this.socket.on('connect', () => {
				resolve(this.socket)
			})
		})*/

		/*
		const simpleOnEvents = ['connect','disconnect','reconnect']

		simpleOnEvents.forEach(event => {
			this[event] = () => {
				return new Promise((resolve) => {
					this.socket.on(event, () => {
						resolve(this.socket)
					})
				})
			}
		})

		const simpleOffEvents = ['connect','disconnect','reconnect']

		simpleOffEvents.forEach(event => {
			this[event] = () => {
				return new Promise((resolve) => {
					this.socket.off(event, () => {
						resolve(this.socket)
					})
				})
			}
		})
		//console.log(this.connect)
		*/
	}

	setSocket (){
		if (!this.socket) {
			this.socket = io(this.url + ':' + this.port, { query: { token: asyncStorage.token }})
		}
	}

	connect (){
		this.setSocket()
		return new Promise((resolve, reject) => {
			this.socket.on('connect', () => {
				resolve(this.socket)
			})
			this.socket.on('connect_error', () => {
				reject()
			})
		})
	}

	disconnect (){
		this.setSocket()
		return new Promise((resolve) => {
			this.socket.on('disconnect', () => {
				resolve(this.socket)
			})
		})
	}

	reconnect (){
		this.setSocket()
		return new Promise((resolve) => {
			this.socket.on('reconnect', () => {
				resolve(this.socket)
			})
		})
	}

	registerHandler (onMessageReceived) {
		this.socket.on('message', onMessageReceived)
	}

	unregisterHandler () {
		this.socket.off('message')
	}

	// emitters
	register (name, cb) {
		this.socket.emit('register', name, cb)
	}

	getAvailableUsers (room, cb) {
		this.socket.emit('availableUsers', room, cb)
	}

	getChatrooms (cb) {
		this.socket.emit('chatrooms', cb)
	}

	addChatroom (chatroomName, cb) {
		this.socket.emit('addChatroom', chatroomName, cb)
	}

	join (chatroomName, cb) {
		this.socket.emit('join', chatroomName, cb)
	}

	leave (chatroomName, cb) {
		this.socket.emit('leave', chatroomName, cb)
	}

	onSendMessage(msg, cb) {
		this.message('test', msg, cb)
	}

	message (chatroomName, msg, cb) {
		this.socket.emit('message', { chatroomName, message: msg }, cb)
	}
}

export default SocketClient
