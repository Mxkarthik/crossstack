import { useEffect, useState } from "react"
import api from "../apiintercepter.js"
import { toast } from "react-toastify"

const Admin = () => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true // prevents state update after unmount

    const fetchAdminData = async () => {
      try {
        const { data } = await api.get("/api/v1/admin", {
          withCredentials: true,
        })

        if (isMounted) {
          setContent(data.message)
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error?.response?.data?.message || "Failed to fetch admin data"
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchAdminData()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <p className="text-white">Loading...</p>
  }

  return (
    <div className="text-white">
      {content && <div>{content}</div>}
    </div>
  )
}

export default Admin
