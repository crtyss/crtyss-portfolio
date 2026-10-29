# Hero PBR assets

All source assets below are CC0. Metal and plastic use normal and roughness maps; wood additionally uses its base-color map. Other base colors and optical properties are configured in the scene. Material names describe the art-directed result, rather than separate scanned sets for each profile.

- Metal033, ambientCG: https://ambientcg.com/view?id=Metal033
  - Metal033_1K-JPG_NormalGL.jpg
  - Metal033_1K-JPG_Roughness.jpg
  - Used for fine metal surface detail and roughness variation.
- Plastic010, ambientCG: https://ambientcg.com/view?id=Plastic010
  - Plastic010_1K-JPG_NormalGL.jpg
  - Plastic010_1K-JPG_Roughness.jpg
  - Used for silicone/plastic surface detail.
- Wood049, ambientCG: https://ambientcg.com/view?id=Wood049
  - Wood049_1K-JPG_Color.jpg (sRGB)
  - Wood049_1K-JPG_NormalGL.jpg (linear data)
  - Wood049_1K-JPG_Roughness.jpg (linear data)
  - Oak grain with matched UVs for all three channels, repeated 3 × 2 along the ribbon.
- Studio Small 09, Sergej Majboroda / Poly Haven: https://polyhaven.com/a/studio_small_09
  - studio-small-09-1k.hdr
  - 1K HDR, used for prefiltered image-based lighting and reflections.

Licenses:
- https://docs.ambientcg.com/license/
- https://polyhaven.com/license

The glass uses physical transmission, IOR, thickness and attenuation with minimal normal-map influence. Silicone, gold, plastic and anodized aluminum are tuned physical material profiles sharing the two underlying texture sets. Wood uses its own matching base-color, normal and roughness maps, with a nonmetallic satin finish. No displacement is applied so the silhouette remains stable during material transitions.
