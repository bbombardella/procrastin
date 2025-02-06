import {Toast, ToastTitle} from '../toast';
import {CheckIcon, Icon} from '../icon';
import {Divider} from '../divider';

export function SuccessToast({uniqueToastId, message = 'Success!'}: {
    uniqueToastId: string,
    message: string
}) {
    return (
        <Toast
            nativeID={uniqueToastId}
            className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
        >
            <Icon
                as={CheckIcon}
                size="xl"
                className="fill-typography-100 stroke-none"
            />
            <Divider
                orientation="vertical"
                className="h-[30px] bg-outline-200"
            />
            <ToastTitle size="sm">{message}</ToastTitle>
        </Toast>
    )
}
