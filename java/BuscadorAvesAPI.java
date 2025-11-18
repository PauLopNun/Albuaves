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
            JSONArray birdsArray = new JSONArray(json);
            System.out.println("🌿 List of birds in Albufera 🌿\n");
            System.out.println("+----+-------------------------+-------------------------+------------------------------+-----------------------+");
            System.out.println("| ID |      Common Name        |    Scientific Name      |        Description           | Image    |");
            System.out.println("+----+-------------------------+-------------------------+------------------------------+-----------------------+");

            for (int i = 0; i < birdsArray.length(); i++) {
                JSONObject bird = birdsArray.getJSONObject(i);
                System.out.printf(
                    "| %2d | %-23s | %-23s | %-28s | %-21s |\n",
                    bird.getInt("bird_id"),
                    truncate(bird.getString("common_name"), 23),
                    truncate(bird.getString("scientific_name"), 23),
                    truncate(bird.getString("description"), 28),
                    truncate(bird.getString("image_url"), 21)
                );
            }

            System.out.println("+----+-------------------------+-------------------------+------------------------------+-----------------------+");
        } catch (Exception e) {
            // If the response is a single object (for example, when searching by ID)

            JSONObject bird = new JSONObject(json);
            System.out.println("\n📜 Bird details 📜");
            System.out.println("ID: " + bird.getInt("bird_id"));
            System.out.println("Common Name: " + bird.getString("common_name"));
            System.out.println("Scientific Name: " + bird.getString("scientific_name"));
            System.out.println("Description: " + bird.getString("description"));
            System.out.println("Image: " + bird.getString("image_url"));

        }
    }

    private static String truncate(String str, int maxLength) {
        if (str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength - 1) + "…";
    }
}
