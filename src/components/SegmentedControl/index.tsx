import SegmentedControl_ from "./SegmentedControl";
import SegmentedControlItem_ from "./SegmentedControlItem";

// @ts-expect-error need to do assignment in 2 steps
const SegmentedControl: typeof SegmentedControl_ & { Item: typeof SegmentedControlItem_ } = SegmentedControl_;
SegmentedControl.Item = SegmentedControlItem_;

export default SegmentedControl;
