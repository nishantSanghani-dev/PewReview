/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios"
import { toast } from "react-toastify"
import { setGlobalLoader } from "../context/LoaderProvider"

const apiOp = {
  showToaster: false,
  showLoader: false,
  useToken: true,
}

export const apiRequest = async (method, endPoint, body = null, params = null, apiOption = apiOp) => {
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/${endPoint}`
  const mergedApiOption = {
    ...apiOp,
    ...apiOption
  }

  if (mergedApiOption.showLoader) {
    setGlobalLoader(true)
  }

  let token = null

  if (mergedApiOption.useToken) {
    token = localStorage.getItem("TOKEN")
  }

  const isFormData = body instanceof FormData
  const headersObj = {
    'Cache-Control': 'no-cache',
  }
  if (!isFormData) {
    headersObj['Content-Type'] = 'application/json'
  }
  if (token) {
    headersObj['Authorization'] = `Bearer ${token}`
  }

  let response
  try {
    switch (method) {
      case "GET":
        response = await axios.get(apiUrl, {
          headers: headersObj,
          params
        })
        break
      case "POST":
        response = await axios.post(apiUrl, body, {
          headers: headersObj,
          params
        })
        break
      case "PUT":
        response = await axios.put(apiUrl, body, {
          headers: headersObj,
          params
        })
        break
      case "DELETE":
        response = await axios.delete(apiUrl, {
          data: body,
          headers: headersObj,
          params,
        });
        break;
      default:
        throw new Error("Invalid Method")
    }
    console.log(response);

    let responseMessage = {
      message: response?.data?.message,
      code: response?.data?.code,
      status: response?.status,
      data: response?.data?.data,
      error: response?.strError,
      token: response?.data?.data?.token
    }
    console.log(responseMessage);

    if (mergedApiOption.showToaster) {
      toast.success(responseMessage.message)
    }
    return responseMessage
  } catch (error) {
    console.log(error.response.status === 401)
    if (error.response.status === 401) {
      mergedApiOption.showToaster = false
      localStorage.removeItem("TOKEN")
    }
    console.log(error.response.data.strError);
    if (error.response.data.strError) {
      toast.error(error.response.data.strError)
      return
    }
    toast.error(error?.response?.data?.message)

    throw error
  } finally {
    if (mergedApiOption.showLoader) {
      setGlobalLoader(false)
    }
  }
} 