import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

public class BuscadorAvesAPI {

    public static void main(String[] args) {
        try {
            // API URL (GET all birds)
            String apiUrl = System.getenv("API_URL");
            if (apiUrl == null || apiUrl.isEmpty()) {
                apiUrl = "http://127.0.0.1:9191/api.php";
            }

            // Perform the GET request
            String respuesta = enviarPeticionGET(apiUrl);

            // Display the response
            System.out.println("API Response:");
            imprimirJSONMono(respuesta);

        } catch (IOException e) {
            System.err.println("Error connecting to the API: " + e.getMessage());
        }
    }

    private static String enviarPeticionGET(String url) throws IOException {
        HttpURLConnection conexion = null;
        BufferedReader reader = null;
        StringBuilder respuesta = new StringBuilder();

        try {
            // Create the connection
            URL apiURL = new URL(url);
            conexion = (HttpURLConnection) apiURL.openConnection();
            conexion.setRequestMethod("GET");
            conexion.setRequestProperty("Accept", "application/json");

            // Verify the response code
            int codigoRespuesta = conexion.getResponseCode();
            if (codigoRespuesta != HttpURLConnection.HTTP_OK) {
                throw new IOException("HTTP Error: " + codigoRespuesta);
            }

            // Read the response
            reader = new BufferedReader(new InputStreamReader(conexion.getInputStream()));
            String linea;
            while ((linea = reader.readLine()) != null) {
                respuesta.append(linea);
            }

        } finally {
            // Close resources
            if (reader != null) {
                reader.close();
            }
            if (conexion != null) {
                conexion.disconnect();
            }
        }

        return respuesta.toString();
    }


private static void imprimirJSONMono(String json) {
        try {
            // If the response is an array of birds
            JSONArray avesArray = new JSONArray(json);
            System.out.println("🌿 List of birds in Albufera 🌿\n");
            System.out.println("+----+----------------+---------------------+----------------+-----------------------+");
            System.out.println("| ID |      Name      |      Scientific     |   Description  | Img    |");
            System.out.println("+----+----------------+---------------------+----------------+-----------------------+");

            for (int i = 0; i < avesArray.length(); i++) {
                JSONObject ave = avesArray.getJSONObject(i);
                System.out.printf(
                    "| %2d | %-14s | %-19s | %-14s | %-21s |\n",
                    ave.getInt("id_ave"),
                    ave.getString("nombre_comun"),
                    ave.getString("nombre_cientifico"),
                    ave.getString("descripcion"),
                    ave.getString("imagen_url")
                );
            }

            System.out.println("+----+----------------+---------------------+----------------+-----------------------+");
        } catch (Exception e) {
            // If the response is a single object (for example, when searching by ID)

            JSONObject ave = new JSONObject(json);
            System.out.println("\n📜 Bird details 📜");
            System.out.println("ID: " + ave.getInt("id_ave"));
            System.out.println("Name: " + ave.getString("nombre_comun"));
            System.out.println("Scientific: " + ave.getString("nombre_cientifico"));
            System.out.println("Description: " + ave.getString("descripcion"));
            System.out.println("Image: " + ave.getString("imagen_url"));

        }
    }
}
