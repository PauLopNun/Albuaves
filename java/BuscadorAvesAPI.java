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
            // URL de la API (GET todas las aves)
            String apiUrl = System.getenv("API_URL");
            if (apiUrl == null || apiUrl.isEmpty()) {
                apiUrl = "http://127.0.0.1:9191/api.php";
            }

            // Realizar la petición GET
            String respuesta = enviarPeticionGET(apiUrl);

            // Mostrar la respuesta
            System.out.println("Respuesta de la API:");
            imprimirJSONMono(respuesta);

        } catch (IOException e) {
            System.err.println("Error al conectar con la API: " + e.getMessage());
        }
    }

    private static String enviarPeticionGET(String url) throws IOException {
        HttpURLConnection conexion = null;
        BufferedReader reader = null;
        StringBuilder respuesta = new StringBuilder();

        try {
            // Crear la conexión
            URL apiURL = new URL(url);
            conexion = (HttpURLConnection) apiURL.openConnection();
            conexion.setRequestMethod("GET");
            conexion.setRequestProperty("Accept", "application/json");

            // Verificar el código de respuesta
            int codigoRespuesta = conexion.getResponseCode();
            if (codigoRespuesta != HttpURLConnection.HTTP_OK) {
                throw new IOException("Error HTTP: " + codigoRespuesta);
            }

            // Leer la respuesta
            reader = new BufferedReader(new InputStreamReader(conexion.getInputStream()));
            String linea;
            while ((linea = reader.readLine()) != null) {
                respuesta.append(linea);
            }

        } finally {
            // Cerrar recursos
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
            // Si la respuesta es un array de aves
            JSONArray avesArray = new JSONArray(json);
            System.out.println("🌿 Lista de aves en la Albufera 🌿\n");
            System.out.println("+----+----------------+---------------------+----------------+-----------------------+");
            System.out.println("| ID |    Nombre      |      Cientifico       |   Descripción    | Img    |");
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
            // Si la respuesta es un solo objeto (por ejemplo, al buscar por ID)
            
            JSONObject ave = new JSONObject(json);
            System.out.println("\n📜 Detalle del ave 📜");
            System.out.println("ID: " + ave.getInt("id_ave"));
            System.out.println("Nombre: " + ave.getString("nombre_comun"));
            System.out.println("Científico: " + ave.getString("nombre_cientifico"));
            System.out.println("Descripción: " + ave.getString("descripcion"));
            System.out.println("Imagen: " + ave.getString("imagen_url"));
            
        }
    }
}