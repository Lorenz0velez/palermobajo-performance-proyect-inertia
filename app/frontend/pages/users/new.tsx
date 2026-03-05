import { Form, Head } from "@inertiajs/react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/layouts/auth-layout"
import { signInPath, signUpPath } from "@/routes"

export default function Register() {
  return (
    <AuthLayout
      title="Crear cuenta"
      description="Completá tus datos para solicitar acceso. Un administrador aprobará tu cuenta."
    >
      <Head title="Registro" />
      <Form
        method="post"
        action={signUpPath()}
        resetOnSuccess={["password", "password_confirmation"]}
        disableWhileProcessing
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              {/* Nombre y apellido */}
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input id="first_name" type="text" name="first_name" required autoFocus autoComplete="given-name" placeholder="Martín" disabled={processing} />
                  <InputError messages={errors.first_name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input id="last_name" type="text" name="last_name" required autoComplete="family-name" placeholder="García" disabled={processing} />
                  <InputError messages={errors.last_name} />
                </div>
              </div>

              {/* DNI */}
              <div className="grid gap-2">
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" type="text" name="dni" required placeholder="xxxxxxxx" maxLength={8} disabled={processing} />
                <InputError messages={errors.dni} />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" required autoComplete="email" placeholder="email@ejemplo.com" disabled={processing} />
                <InputError messages={errors.email} />
              </div>

              {/* Registrarse como */}
              <div className="grid gap-2">
                <Label>Quiero registrarme como</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pending_role" value="player" defaultChecked className="accent-bordo-700" />
                    <span className="text-sm">Jugador</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pending_role" value="coach" className="accent-bordo-700" />
                    <span className="text-sm">Entrenador</span>
                  </label>
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" name="password" required autoComplete="new-password" placeholder="Mínimo 12 caracteres" disabled={processing} />
                <InputError messages={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                <Input id="password_confirmation" type="password" name="password_confirmation" required autoComplete="new-password" placeholder="Repetí la contraseña" disabled={processing} />
                <InputError messages={errors.password_confirmation} />
              </div>
            </div>

            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
              {processing ? "Enviando..." : "Solicitar acceso"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              ¿Ya tenés cuenta?{" "}
              <TextLink href={signInPath()} tabIndex={6}>
                Iniciar sesión
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  )
}
