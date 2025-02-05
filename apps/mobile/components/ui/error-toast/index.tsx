import {Button, ButtonText} from "../button";
import {HStack} from "../hstack";
import {Pressable} from "react-native";
import {Toast, ToastDescription, ToastTitle} from "../toast";
import {VStack} from "../vstack";
import {CloseIcon, HelpCircleIcon, Icon} from "../icon";
import React from "react";

export function ErrorToast({uniqueToastId, message = 'Something went wrong.', onClose, onRetry}: {
    uniqueToastId: string,
    message: string,
    onClose: () => void,
    onRetry?: () => void
}) {
    return (
        <Toast
            action="error"
            variant="outline"
            nativeID={uniqueToastId}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[500px] flex-row justify-between"
        >
            <HStack space="md">
                <Icon
                    as={HelpCircleIcon}
                    className="stroke-error-500 mt-0.5"
                />
                <VStack space="xs">
                    <ToastTitle className="font-semibold text-error-500">Error!</ToastTitle>
                    <ToastDescription size="sm">
                        {message}
                    </ToastDescription>
                </VStack>
            </HStack>
            <HStack className="min-[450px]:gap-3 gap-1">
                {onRetry &&
                    <Button variant="link" size="sm" className="px-3.5 self-center">
                        <ButtonText>Retry</ButtonText>
                    </Button>}
                <Pressable onPress={onClose}>
                    <Icon as={CloseIcon}/>
                </Pressable>
            </HStack>
        </Toast>
    );
}
