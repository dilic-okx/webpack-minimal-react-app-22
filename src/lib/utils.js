import history from './history'
import { default as BigNumberInstance } from './bignumber'

import navConfig from '../.nav-config'
import { getConfig } from '../.app-config'

export const BigNumber = BigNumberInstance
export const getAppConfig = getConfig

export const getComponentByDomNode = (querySelector) => {
	const dom = global.window.document.querySelector(querySelector)
    for (const key in dom) {
        if (key.startsWith('__reactInternalInstance$')) {
			const reactNode = dom[key]
			if (reactNode._currentElement){
				// v15 < react < v16
				const compInternals = reactNode._currentElement
				if (compInternals){
					const compWrapper = compInternals._owner
					if (compWrapper){
						return compWrapper._instance
					}
				}
			}else{
				// react v16+
				return reactNode && reactNode.return && reactNode.return.stateNode
			}
        }
    }
    return null
}

// declarative "nav to"
export const forwardTo = (location, historyState = null) => {
	if (location === history.location.pathname){
		return
	}
	history.push(location, historyState)
	if (global.window){
		const drawer = getComponentByDomNode('aside.mdc-drawer')
		if (drawer && drawer.props.open){
			drawer.props.onClose()
		}
	}
}

export const goBack = () => history.goBack()

export const getDefaultRoute = (protectedRoute) => {
	protectedRoute = protectedRoute ? protectedRoute : false
	let defaultRoute = navConfig.routes.find(item => item.default === true && (protectedRoute ? item.protected === true : item.protected !== true))
	if (!defaultRoute){
		defaultRoute = navConfig.routes.find(item => protectedRoute ? item.protected === true : item.protected !== true)
	}
	return defaultRoute || navConfig.routes[0]
}

export const getHistoryState = (path = null) => !path ? null : getPropertyByPath(history, 'location.state.' + path)

export const getScrollbarWidth = (elm) => {
	let scrollbarWidth = 0
	if (elm){
		scrollbarWidth = elm.offsetWidth - elm.clientWidth
	}else if (global && global.window){
		scrollbarWidth = global.window.innerWidth - global.window.document.documentElement.clientWidth
	}
	return scrollbarWidth
}

/**
 * Helper utility function
 * checking if `item` is not `undefined` and not `null`
 * @public
 * @function
 * @param {object|string|array|number} item - source object with property "path" we want to check
 * @return {boolean} item is defined or not
 */
export const isDefined = item => item !== undefined && item !== null

/**
 * Check if object have defined some path.
 * (e.g. path='someObj.property1.property2')
 * @public
 * @param {Object} object object for check
 * @param {String} [path=''] object for check
 * @return {Boolean}
 * @function
 */
export const deepIsDefined = (object, path = '') => {
	let def = true
	let obj = { ...object }
	const arr = path.split('.')

	arr.forEach(level => {
		if (!obj[level]) {
			def = false
			return
		}
		obj = obj[level]
	})
	return def
}

export const setPropertyByPath = (object, path = '', value) => {
	if (path.indexOf('.') === -1) {
		if (isDefined(value)) {
			object[path] = value
		}
		return object
	} else {
		let paths = path.split('.')
		const singlePath = paths[0]
		paths = paths.slice(1, paths.length)
		if (!object[singlePath]) {
			object[singlePath] = {}
		}
		setPropertyByPath(object[singlePath], paths.join('.'), value)
		return object
	}
}

export const getPropertyByPath = (object, path = '') => {
	if (path.indexOf('.') === -1) {
		return object[path]
	} else {
		let paths = path.split('.')
		const singlePath = paths[0]
		paths = paths.slice(1, paths.length)
		if (!object[singlePath]) {
			return null
		}
		return getPropertyByPath(object[singlePath], paths.join('.'))
	}
}

export const padNumber = (num, size) => {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

/**
 * Simulate wait of some operation
 * @public
 * @function
 * @param {number} ms milliseconds
 * @return {Promise}
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Remove white spaces from string from the left side
 * @public
 * @function
 * @param {string} s string to parse
 * @param {string} char_mask
 * @return {string}
 */
export const lTrim = (s, char_mask) => {
	const whitespace = ' \t\n\r' + (char_mask || '')

	if (whitespace.indexOf(s.charAt(0)) !== -1){
		let j = 0, i = s.length
		while (j < i && whitespace.indexOf(s.charAt(j)) !== -1){
			j++
		}
		s = s.substring(j, i)
	}

	return s
}

/**
 * Remove white spaces from string from the right side
 * @public
 * @function
 * @param {string} s string to parse
 * @param {string} char_mask
 * @return {string}
 */
export const rTrim = (s, char_mask) => {
	const whitespace = ' \t\n\r' + (char_mask || '')

	if (whitespace.indexOf(s.charAt(s.length - 1)) !== -1){
		let i = s.length - 1
		while (i >= 0 && whitespace.indexOf(s.charAt(i)) !== -1){
			i--
		}
		s = s.substring(0, i + 1)
	}

	return s
}

/**
 * Remove white spaces from string
 * @public
 * @function
 * @param {string} s string to parse
 * @param {string} char_mask
 * @return {string}
 */
export const trim = (s, char_mask) => rTrim(lTrim(s, char_mask), char_mask)

export const fileSize = (sizeB, unit) => {
	const validUnits = ['B','kB','MB','GB','TB']
	const dv = 1024
	const intSize = parseInt(sizeB, 10)
	let unitIndex = 0
	let size = new BigNumber(intSize)
	if (unit){
		if (validUnits.map(vu => vu.toLowerCase()).indexOf(unit.toLowerCase()) === -1){
			if (unit.indexOf('i') !== -1 || unit.indexOf('I') !== -1){
				console.error('BS "bi-bi-bytes" units (kiB, MiB, GiB, TiB) are not supported!')
			}else{
				console.error('Invalid file size unit "' + unit + '" provided!')
			}
			return intSize
		}
		if (unit.toLowerCase() === 'kb'){
			size = size.div(dv)
			unitIndex = 1
		}else if (unit.toLowerCase() === 'mb'){
			size = size.div(dv).div(dv)
			unitIndex = 2
		}else if (unit.toLowerCase() === 'gb'){
			size = size.div(dv).div(dv).div(dv)
			unitIndex = 3
		}else if (unit.toLowerCase() === 'tb'){
			size = size.div(dv).div(dv).div(dv).div(dv)
			unitIndex = 4
		}else{
			unitIndex = 0
		}
	}else{
		while (size.toNumber() > dv && unitIndex < validUnits.length - 1){
			size = size.div(dv)
			unitIndex++
		}
	}
	return size.toFormat(2, BigNumber.ROUND_HALF_CEIL) + ' ' + validUnits[unitIndex]
}

export const getCssVar = (varName) => {
	const varValue = getComputedStyle(document.documentElement).getPropertyValue(varName)
	return varValue || null
}

export const form2data = (elements, ignoreEmpty = false, addFileNamesToRoot = false) => {
	return [].reduce.call(elements, (data, element) => {
		if (element.tagName.toLowerCase() === 'button' || ['button','submit','reset'].includes(element.type) || element.classList.contains('ignore-element')){
			return data
		}
		if (!element.name){
			console.error('No name attribute', element)
			throw new Error('This is uncontrolled form elements setup and some of them are missing name attribute')
		}
		if (!element.validity.valid){
			if (!data.errors){
				data.errors = {}
			}
			const errors = []
			for (const vKey in element.validity){
				if (vKey !== 'valid'){
					if (element.validity[vKey]){
						errors.push(vKey)
					}
				}
			}
			data.errors[element.name] = errors.join(', ')
		}
		if (!['checkbox', 'radio'].includes(element.type) || element.checked){
			if (ignoreEmpty && !element.value){
				return data
			}
			if (element.type === 'file'){
				if (!data.files){
					data.files = {}
				}
				if (element.multiple){
					if (addFileNamesToRoot){
						data[element.name] = [].reduce.call(element.files, (values, file) => {
							return values.concat(file.name)
						}, [])
					}
					data.files[element.name] = element.files
				}else{
					if (addFileNamesToRoot){
						data[element.name] = element.files[0].name
					}
					data.files[element.name] = element.files[0]
				}
			}else if (element.options && element.multiple){
				data[element.name] = [].reduce.call(element.options, (values, option) => {
					return option.selected ? values.concat(option.value) : values
				}, [])
			}else if (element.name.substr(-2) === '[]'){
				const arrayName = element.name.substr(0, element.name.length - 2)
				data[arrayName] = (data[arrayName] || []).concat(element.value)
			}else{
				data[element.name] = element.type === 'checkbox' && element.value === 'on' ? true : element.value
			}
		}
		return data
	}, {})
}

export const form2JSON = (elements, ignoreEmpty = false, addFileNamesToRoot = false) => JSON.stringify(form2data(elements, ignoreEmpty, addFileNamesToRoot))
