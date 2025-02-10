import {ErrorToast} from '../components/ui/error-toast';
import {SuccessToast} from '../components/ui/success-toast';
import {useToast} from '../components/ui/toast';
import * as Haptics from 'expo-haptics';

export const showNewToast = (
    toast: ReturnType<typeof useToast>,
    message: string,
    setToastId: (id: string) => void,
    error: boolean = false
) => {
    const uniqueToastId = `toast-edit-profile-${Math.random()}`
    setToastId(uniqueToastId)
    toast.show({
        id: uniqueToastId,
        placement: "top",
        duration: 5000,
        render: ({id}) => {
            if (error) {
                return <ErrorToast uniqueToastId={id} message={message} onClose={() => toast.close(uniqueToastId)}/>
            } else {
                return <SuccessToast uniqueToastId={id} message={message}/>
            }
        }
    })

    if (process.env.EXPO_OS && process.env.EXPO_OS !== 'web') {
        Haptics.notificationAsync(error ? Haptics.NotificationFeedbackType.Error : Haptics.NotificationFeedbackType.Success)
    }
}
