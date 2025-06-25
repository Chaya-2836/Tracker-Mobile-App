import java.net.URL
import javax.net.ssl.HttpsURLConnection

tasks.register("checkSSL") {
    doLast {
        val url = URL("https://dl.google.com")
        val conn = url.openConnection() as HttpsURLConnection
        conn.connect()
        println("✅ Success! Connected to ${url.host} with cert: " + conn.serverCertificates.first())
    }
}
