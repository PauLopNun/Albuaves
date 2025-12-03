INSERT INTO birds (bird_id, common_name, scientific_name, description, image_url)
VALUES
  (1, 'Black-crowned Night Heron', 'Nycticorax nycticorax', 'Nocturnal bird with black and white plumage, common in wetlands.', 'imgs/aves/martinete.jpg'),
  (2, 'Grey Heron', 'Ardea cinerea', 'Large and elegant, with grey plumage and long bill.', 'imgs/aves/garza_real.jpg'),
  (3, 'Greater Flamingo', 'Phoenicopterus roseus', 'Pink bird with long legs, typical of saline areas.', 'imgs/aves/flamenco_comun.jpg'),
  (4, 'Mallard', 'Anas platyrhynchos', 'Common duck, male with green head and yellow bill.', 'imgs/aves/anade_real.jpg'),
  (5, 'Common Tern', 'Sterna hirundo', 'Seabird with agile flight, red and black bill.', 'imgs/aves/charran_comun.jpg'),
  (6, 'Great Crested Grebe', 'Podiceps cristatus', 'Elegant swimmer with crest and long neck.', 'imgs/aves/somormujo_lavanco.jpg'),
  (7, 'Purple Swamphen', 'Porphyrio porphyrio', 'Bird with intense blue plumage, red bill and legs.', 'imgs/aves/calamon_comun.jpg'),
  (8, 'Eurasian Bittern', 'Botaurus stellaris', 'Elusive bird with brown plumage, similar to an owl.', 'imgs/aves/avetoro_comun.jpg'),
  (9, 'Red-crested Pochard', 'Netta rufina', 'Male with red head and bright red bill.', 'imgs/aves/pato_colorado.jpg'),
  (10, 'Western Marsh Harrier', 'Circus aeruginosus', 'Raptor with long wings, inhabits wetlands.', 'imgs/aves/aguilucho_lagunero.jpg');

INSERT INTO sightings (sighting_id, bird_id, date, time, location, observations)
VALUES
  (1, 3, '2025-10-15', '09:30:00', 'Albufera Lagoon', 'Group of 12 flamingos feeding in shallow water.'),
  (2, 1, '2025-10-16', '18:00:00', 'Lake Shore', 'Night heron perched on a reed at sunset.'),
  (3, 5, '2025-10-17', '11:15:00', 'El Palmar Island', 'Terns fishing in a group near the coast.'),
  (4, 2, '2025-10-18', '07:45:00', 'Albufera Lagoon', 'Grey heron hunting fish in the morning mist.'),
  (5, 4, '2025-10-19', '14:20:00', 'Rice Fields', 'Male mallard leading a group of 6 ducks.'),
  (6, 7, '2025-10-20', '16:30:00', 'Marsh Area', 'Purple swamphen walking among reeds, very colorful.'),
  (7, 9, '2025-10-21', '10:00:00', 'Central Lake', 'Pair of red-crested pochards diving for food.'),
  (8, 6, '2025-10-22', '08:15:00', 'Deep Water Zone', 'Great crested grebe performing courtship display.'),
  (9, 10, '2025-10-23', '17:00:00', 'Wetland Perimeter', 'Western marsh harrier flying low over vegetation.'),
  (10, 8, '2025-10-24', '06:30:00', 'Dense Reed Bed', 'Eurasian bittern heard calling, difficult to spot.');
