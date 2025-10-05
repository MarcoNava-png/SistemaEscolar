// components/AlertButton.tsx
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function AlertButton() {
  const handleClick = () => {
    MySwal.fire({
      title: <strong>¿Quieres continuar?</strong>,
      html: (
        <div>
          <p>Esta es una alerta con contenido React personalizado.</p>
          <p>Puedes incluir etiquetas <code>JSX</code>.</p>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire('Confirmado', 'Has aceptado continuar.', 'success')
      } else if (result.isDismissed) {
        MySwal.fire('Cancelado', 'No se realizó ninguna acción.', 'info')
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Mostrar alerta
    </button>
  )
}