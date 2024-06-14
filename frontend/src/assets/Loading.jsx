import FadeLoader from "react-spinners/FadeLoader";
export default function Loading() {
    return <>
        <div className="loading-screen fcc">
            <FadeLoader
                color='#fff'
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div></>
}