'use client'
import BtnBackIcon from '~/assets/btn_back.svg'
import IconCamera from '~/assets/icon_camera.svg'
import IconAdd from '~/assets/icon_add-mini.svg'
import { Card } from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useStudyroomController from '~/hooks/useStudyroomController'
import useAssignmentController from '~/hooks/useAssignmentController'
import Image from 'next/image'
import { getUser } from '~/apis/user-rls'

export default function Assignment() {
  const searchParams = useSearchParams()
  const description = searchParams.get('description')
  const method = searchParams.get('method')
  const [preview, setPreview] = useState('')

  const { register, handleSubmit, setValue, reset } = useForm()
  const { handleAddImage, handleDeleteImage } = useStudyroomController()
  const { handleSubmitAssignment } = useAssignmentController()

  const router = useRouter()
  const params = useParams()
  const study_id = params.studyId
  const assignment_id = params.id

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      handleAddImage(file).then((url) => {
        if (url) {
          setValue('file', url)
        }
      })
    }
  }
  const deleteFile = () => {
    handleDeleteImage()
    setPreview('')
    setValue('file', '')
  }

  const onSubmitAssignment = async (data: any) => {
    const userData = await getUser()
    const user_id = userData?.id
    handleSubmitAssignment(
      data.text,
      data.file,
      study_id,
      user_id,
      assignment_id,
    ).then((id: string) => {
      router.push(`/studyroom/${study_id}/assignment/complete/${id}`)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmitAssignment)}>
      <div className="h-dvh bg-background">
        <div className="flex flex-row space-x-32 border-b-2 p-3 align-baseline">
          <a href={`/studyroom/${study_id}`}>
            <BtnBackIcon />
          </a>
          <h2 className="font-bold">과제 인증</h2>
        </div>
        <section className="bg-background px-3">
          <div className="py-6">
            <h2 className="text-xl font-bold">{description}</h2>
            <p className="text-meetie-gray-40">{method}</p>
          </div>
          <Card className="flex h-44 justify-center bg-[#F5F5F5]">
            {!preview && (
              <Label htmlFor="assign-pic" className="my-14 block">
                <div className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-meetie-blue-3">
                  <div className="absolute -right-1 -top-1 rounded-full bg-meetie-gray-20 p-1">
                    <IconAdd />
                  </div>
                  <IconCamera />
                </div>
              </Label>
            )}
            <Input
              id="assign-pic"
              type="file"
              className="hidden"
              {...register('file')}
              onChange={handleImageChange}
            />
            {/* 이미지 미리보기 */}
            {preview && (
              <>
                <div className="flex h-full w-full items-center justify-center">
                  <Image
                    width={360}
                    height={240}
                    src={preview}
                    alt="미리보기"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div
                  className="absolute right-4 mt-1 rotate-45 cursor-pointer rounded-full border-2 border-meetie-blue-2 bg-white p-1"
                  onClick={deleteFile}
                >
                  <IconAdd />
                </div>
              </>
            )}
          </Card>
          <div>
            <h2 className="mt-10 pb-4 font-bold">소개</h2>
            <Textarea
              placeholder="과제를 하며 나누고 싶은 생각을 적어보세요."
              className="resize-none bg-[#F5F5F5]"
              {...register('text', { required: true })}
              rows={6}
            />
          </div>
          <Button className="mb-1 mt-8 w-full" type="submit">
            인증하기
          </Button>
          {/* <div className="mt-2 flex justify-center">
            <button className="text-sm font-normal text-meetie-gray-40 underline">
              임시 저장
            </button>
          </div> */}
        </section>
      </div>
    </form>
  )
}
