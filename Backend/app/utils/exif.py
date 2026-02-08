from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS


def _convert_to_degrees(value):
    d = value[0][0] / value[0][1]
    m = value[1][0] / value[1][1]
    s = value[2][0] / value[2][1]
    return d + (m / 60.0) + (s / 3600.0)


def extract_gps(image_path: str):
    image = Image.open(image_path)
    exif_data = image._getexif()

    if not exif_data:
        return None

    gps_info = {}

    for tag, value in exif_data.items():
        decoded = TAGS.get(tag)
        if decoded == "GPSInfo":
            for t in value:
                sub_decoded = GPSTAGS.get(t)
                gps_info[sub_decoded] = value[t]

    if "GPSLatitude" not in gps_info or "GPSLongitude" not in gps_info:
        return None

    lat = _convert_to_degrees(gps_info["GPSLatitude"])
    lng = _convert_to_degrees(gps_info["GPSLongitude"])

    if gps_info.get("GPSLatitudeRef") == "S":
        lat = -lat
    if gps_info.get("GPSLongitudeRef") == "W":
        lng = -lng

    return lat, lng
