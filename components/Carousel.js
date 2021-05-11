import Slider from "react-slick";
import Link from "next/link";
export default function Carousel() {
  var settings = {
    infinite: true,
    speed: 3000,
    autoplay: true,
    slidesToShow: 5,
    cssEase: "linear",
  };

  return (
    <Slider {...settings}>
      <div>
        <Link href="/playlist/NO">
          <img
            src="/flags/NO.png"
            style={{ borderRadius: 30, height: 100, width: 150 }}
          ></img>
        </Link>
      </div>

      <div>
        <img
          src="/flags/US.png"
          style={{ borderRadius: 30, height: 100, width: 150 }}
          onClick={() => console.log("MURICA")}
        ></img>
      </div>

      <div>
        <Link href="/playlist/DE">
          <img
            src="/flags/DE.png"
            style={{ borderRadius: 30, height: 100, width: 150 }}
          ></img>
        </Link>
      </div>
      <div>
        <img
          src="/flags/TR.png"
          style={{ borderRadius: 30, height: 100, width: 150 }}
        ></img>
      </div>
      <div>
        <img
          src="/flags/GR.png"
          style={{ borderRadius: 30, height: 100, width: 150 }}
        ></img>
      </div>
      <div>
        <img
          src="/flags/FR.png"
          style={{ borderRadius: 30, height: 100, width: 150 }}
        ></img>
      </div>
    </Slider>
  );
}
