INSERT INTO aves (id_ave, nombre_comun, nombre_cientifico, descripcion, imagen_url)
VALUES
  (1, 'Martinete', 'Nycticorax nycticorax', 'Nocturnal bird with black and white plumage, common in wetlands.', 'imgs/aves/martinete.jpg'),
  (2, 'Garza real', 'Ardea cinerea', 'Large and elegant, with grey plumage and long bill.', 'imgs/aves/garza_real.jpg'),
  (3, 'Flamenco común', 'Phoenicopterus roseus', 'Pink bird with long legs, typical of saline areas.', 'imgs/aves/flamenco_comun.jpg'),
  (4, 'Ánade real', 'Anas platyrhynchos', 'Common duck, male with green head and yellow bill.', 'imgs/aves/anade_real.jpg'),
  (5, 'Charran común', 'Sterna hirundo', 'Seabird with agile flight, red and black bill.', 'imgs/aves/charran_comun.jpg'),
  (6, 'Somormujo lavanco', 'Podiceps cristatus', 'Elegant swimmer with crest and long neck.', 'imgs/aves/somormujo_lavanco.jpg'),
  (7, 'Calamón común', 'Porphyrio porphyrio', 'Bird with intense blue plumage, red bill and legs.', 'imgs/aves/calamon_comun.jpg'),
  (8, 'Avetoro común', 'Botaurus stellaris', 'Elusive bird with brown plumage, similar to an owl.', 'imgs/aves/avetoro_comun.jpg'),
  (9, 'Pato colorado', 'Netta rufina', 'Male with red head and bright red bill.', 'imgs/aves/pato_colorado.jpg'),
  (10, 'Aguilucho lagunero', 'Circus aeruginosus', 'Raptor with long wings, inhabits wetlands.', 'imgs/aves/aguilucho_lagunero.jpg');

INSERT INTO avistamientos (id_avistamiento, id_ave, fecha, hora, ubicacion, observaciones)
VALUES
  (1, 3, '2025-10-15', '09:30:00', 'Laguna de la Albufera', 'Group of 12 flamingos feeding.'),
  (2, 1, '2025-10-16', '18:00:00', 'Ribera del lago', 'Martinete perched on a reed at sunset.'),
  (3, 5, '2025-10-17', '11:15:00', 'Isla de El Palmar', 'Terns fishing in a group.');
