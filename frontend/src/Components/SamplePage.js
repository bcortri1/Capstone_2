import SampleList from "./SampleList";
import SampleForm from "./SampleForm";

const SamplePage = ({ currUser, samples, setSamples, loading }) => {

    return (
        <>
            <SampleForm currUser={currUser} setSamples={setSamples} />
            <SampleList currUser={currUser} samples={samples} setSamples={setSamples} loading={loading} />
        </>
    )
}
export default SamplePage