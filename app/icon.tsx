import { ImageResponse } from "next/og";

const size = {
    width: 32,
    height: 32,
};

export default function Icon() {
    return new ImageResponse(
        <img
            src="https://github.com/RobertSDM.png"
            style={{
                borderRadius: "50%",
            }}
        />,
        { ...size },
    );
}
